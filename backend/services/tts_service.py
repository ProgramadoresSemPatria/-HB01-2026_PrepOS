from typing import Literal

from fastapi import HTTPException
from openai import AsyncOpenAI, OpenAIError

from core.config import settings


class TTSService:
    def __init__(self) -> None:
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)

    async def synthesize(self, text: str, voice: Literal["alloy", "nova"] = "alloy") -> bytes:
        try:
            response = await self.client.audio.speech.create(
                model="tts-1",
                voice=voice,
                input=text,
            )
            return response.content
        except OpenAIError:
            raise HTTPException(status_code=503, detail="Serviço de TTS indisponível. Tente novamente.")
