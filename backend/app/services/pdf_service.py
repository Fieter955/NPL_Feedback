import fitz  # PyMuPDF
from io import BytesIO

async def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    try:
        # Open PDF from bytes
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        for page in doc:
            text += page.get_text("text") + "\n"
        doc.close()
    except Exception as e:
        raise ValueError(f"Failed to read PDF file: {str(e)}")
    
    return text
