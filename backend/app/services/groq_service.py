import json
import logging
from groq import AsyncGroq
from app.core.config import settings
from app.prompts.essay_prompt import (
    STAGE_1_SYSTEM_PROMPT, generate_stage_1_user_prompt,
    STAGE_2_SYSTEM_PROMPT, generate_stage_2_user_prompt
)
from fastapi import HTTPException
import asyncio

logger = logging.getLogger(__name__)

class GroqService:
    def __init__(self):
        if not settings.GROQ_API_KEY:
            logger.warning("GROQ_API_KEY is not set.")
        self.client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        self.model = settings.GROQ_MODEL

    async def evaluate_essay(self, text: str) -> dict:
        # STAGE 1: MACRO ANALYSIS
        logger.info("Starting Stage 1: Macro Analysis")
        critique = await self._call_llm(
            system_prompt=STAGE_1_SYSTEM_PROMPT,
            user_prompt=generate_stage_1_user_prompt(text),
            json_mode=False
        )
        
        # STAGE 2: EVIDENCE SEARCH & JSON SYNTHESIS
        logger.info("Starting Stage 2: Evidence Search & Synthesis")
        final_json_str = await self._call_llm(
            system_prompt=STAGE_2_SYSTEM_PROMPT,
            user_prompt=generate_stage_2_user_prompt(text, critique),
            json_mode=True
        )
        
        try:
            return json.loads(final_json_str)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse final JSON: {e}. Content: {final_json_str}")
            raise HTTPException(status_code=502, detail="AI returned invalid JSON in final stage.")

    async def _call_llm(self, system_prompt: str, user_prompt: str, json_mode: bool = False) -> str:
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = await asyncio.wait_for(
                    self.client.chat.completions.create(
                        model=self.model,
                        messages=messages,
                        temperature=0.2 if json_mode else 0.5,
                        max_tokens=4096,
                        response_format={"type": "json_object"} if json_mode else {"type": "text"}
                    ),
                    timeout=90.0 # Increased timeout for two-stage process
                )
                return response.choices[0].message.content
            except asyncio.TimeoutError:
                logger.error(f"Groq API timeout on attempt {attempt+1}")
                if attempt == max_retries - 1:
                    raise HTTPException(status_code=504, detail="AI evaluation timed out.")
            except Exception as e:
                logger.error(f"Groq API error on attempt {attempt+1}: {e}")
                if attempt == max_retries - 1:
                    raise HTTPException(status_code=502, detail=f"AI evaluation failed: {str(e)}")
            
            await asyncio.sleep(2 ** attempt)
        
        raise HTTPException(status_code=500, detail="Unexpected error in AI call.")
