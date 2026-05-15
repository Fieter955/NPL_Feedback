from docx import Document
from io import BytesIO

async def extract_text_from_docx(file_bytes: bytes) -> str:
    text = ""
    try:
        doc = Document(BytesIO(file_bytes))
        for para in doc.paragraphs:
            text += para.text + "\n"
    except Exception as e:
        raise ValueError(f"Failed to read DOCX file: {str(e)}")
    
    return text
