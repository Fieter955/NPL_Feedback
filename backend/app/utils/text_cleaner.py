import re

def clean_text(text: str) -> str:
    if not text:
        return ""
    
    # Remove null bytes
    text = text.replace('\x00', '')
    
    # Replace multiple newlines with a single newline
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Remove non-printable characters (excluding newlines and tabs)
    text = ''.join(char for char in text if char.isprintable() or char in ['\n', '\t'])
    
    # Replace multiple spaces with a single space
    text = re.sub(r'[ \t]+', ' ', text)
    
    return text.strip()
