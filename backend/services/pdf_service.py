import io

import pdfplumber
from fastapi import HTTPException, UploadFile


class PDFService:
    async def extract(self, pdf_file: UploadFile) -> str:
        if pdf_file.content_type not in ("application/pdf", "application/octet-stream"):
            raise HTTPException(status_code=422, detail="Arquivo deve ser um PDF válido.")

        contents = await pdf_file.read()
        if not contents:
            raise HTTPException(status_code=422, detail="PDF enviado está vazio.")

        try:
            with pdfplumber.open(io.BytesIO(contents)) as pdf:
                pages_text = [page.extract_text() or "" for page in pdf.pages]
                text = "\n".join(pages_text).strip()
        except Exception:
            raise HTTPException(status_code=422, detail="Não foi possível extrair texto do PDF.")

        if not text:
            raise HTTPException(status_code=422, detail="PDF não contém texto extraível.")

        return text
