from app.services.pdf_service import extract_text_from_pdf
from app.services.docx_service import extract_text_from_docx
from app.utils.text_cleaner import clean_text
from app.services.groq_service import GroqService
from fastapi import UploadFile, HTTPException

class ScoringService:
    def __init__(self):
        self.groq_service = GroqService()

    async def process_and_evaluate(self, file: UploadFile) -> tuple[str, dict]:
        # Validate file
        filename = file.filename
        content = await file.read()
        
        if not content:
            raise HTTPException(status_code=400, detail="File is empty.")
            
        # Extract text based on file type
        if filename.lower().endswith('.pdf'):
            raw_text = await extract_text_from_pdf(content)
        elif filename.lower().endswith('.docx'):
            raw_text = await extract_text_from_docx(content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF or DOCX.")
            
        # Clean text
        cleaned_text = clean_text(raw_text)
        
        if len(cleaned_text) < 50:
            raise HTTPException(status_code=400, detail="Extracted text is too short or empty. Ensure the document contains readable text.")

        # Chunking if needed (Simplified for MVP, LLaMA 3 70B has 8k context which is sufficient for most essays)
        # If essay > ~6k words, we would chunk. Assuming normal essays for now.
        
        # Evaluate with Groq
        evaluation_result = await self.groq_service.evaluate_essay(cleaned_text)
        
        return cleaned_text, evaluation_result
