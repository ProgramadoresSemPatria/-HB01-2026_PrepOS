from fastapi import APIRouter, Depends, Form, UploadFile # type: ignore

from models.schemas import AnalyzeResponse
from services.llm_service import LLMService
from services.pdf_service import PDFService

router = APIRouter(prefix="/analyze", tags=["analyze"])


@router.post("/", response_model=AnalyzeResponse)
async def analyze(
    pdf_file: UploadFile,
    job_text: str = Form(...),
    pdf_svc: PDFService = Depends(),
    llm_svc: LLMService = Depends(),
) -> AnalyzeResponse:
    candidate_text = await pdf_svc.extract(pdf_file)
    return await llm_svc.analyze(candidate_text, job_text)
