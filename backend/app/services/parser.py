import pdfplumber
import io
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class ResumeParser:
    """Service for parsing PDF resumes and extracting text content"""
    
    def __init__(self):
        pass
    
    def extract_text(self, pdf_content: bytes) -> str:
        """Extract text content from PDF bytes"""
        try:
            text = ""
            with pdfplumber.open(io.BytesIO(pdf_content)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            
            return text.strip()
            
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {str(e)}")
            raise Exception("Failed to extract text from PDF")
    
    def extract_tables(self, pdf_content: bytes) -> list:
        """Extract tables from PDF (if any)"""
        try:
            tables = []
            with pdfplumber.open(io.BytesIO(pdf_content)) as pdf:
                for page in pdf.pages:
                    page_tables = page.extract_tables()
                    if page_tables:
                        tables.extend(page_tables)
            
            return tables
            
        except Exception as e:
            logger.error(f"Error extracting tables from PDF: {str(e)}")
            return []