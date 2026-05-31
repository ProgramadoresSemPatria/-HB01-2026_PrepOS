import logging
from typing import Literal

from fastapi import HTTPException
from openai import APITimeoutError, AsyncOpenAI, OpenAIError

from core.config import settings

logger = logging.getLogger(__name__)


class TTSService:
    def __init__(self) -> None:
        # timeout (httpx) no client garante o limite de 30s também no TTS.
        self.client = AsyncOpenAI(
            api_key=settings.openai_api_key,
            timeout=settings.llm_timeout_seconds,
        )

    async def synthesize(self, text: str, voice: Literal["alloy", "nova"] = "alloy") -> bytes:
        try:
            response = await self.client.audio.speech.create(
                model="tts-1",
                voice=voice,
                input=text,
            )
            return response.content
        except APITimeoutError:
            # Traceback logado para observabilidade (capturado pelo Sentry, se ativo).
            logger.exception("Timeout na chamada de TTS à OpenAI")
            raise HTTPException(
                status_code=503,
                detail="O serviço de TTS demorou para responder. Tente novamente.",
            )
        except OpenAIError:
            logger.exception("Erro na chamada de TTS à OpenAI")
            raise HTTPException(
                status_code=503,
                detail="Serviço de TTS indisponível. Tente novamente.",
            )
