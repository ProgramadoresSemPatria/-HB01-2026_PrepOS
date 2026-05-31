# CareerSync — Plataforma de Preparação para Entrevistas Técnicas

CareerSync é uma plataforma inteligente que ajuda desenvolvedores a se prepararem para entrevistas técnicas de forma personalizada, do upload do currículo até a simulação de entrevista por áudio.

## Problema Resolvido

Candidatos chegam a entrevistas técnicas sem saber exatamente onde estão seus gaps em relação à vaga. O CareerSync analisa o currículo e a descrição da vaga com IA, gera um match score real, monta um plano de estudo de 7 dias, recomenda problemas LeetCode relevantes, gera pitches STAR a partir das experiências do candidato e simula uma entrevista completa com feedback em tempo real.

## Stack Utilizada

**Frontend**
- React 18 + TypeScript + Vite
- Zustand (estado global com persistência)
- TanStack React Query v5
- Tailwind CSS v3
- React Router v6

**Backend**
- FastAPI + Python 3.12
- OpenAI GPT-4o-mini (análise, roadmap, feedback)
- OpenAI TTS tts-1 (síntese de voz)
- pdfplumber (extração de texto de PDF)
- SQLModel + PostgreSQL
- Supabase Storage

**Infraestrutura**
- Railway (backend)
- Vercel (frontend)

## Funcionalidades Principais

- Upload do currículo em PDF e extração de texto
- Match score de aderência à vaga com lista de gaps identificados
- Plano de estudo de 7 dias gerado por IA baseado nos gaps
- Explicação objetiva de cada skill para entrevistas
- Seleção personalizada de problemas LeetCode por perfil e gaps
- Avaliação de código com análise de complexidade e dicas de melhoria
- Geração de cartões de pitch STAR a partir do histórico do candidato
- Simulador de entrevista com perguntas em áudio (TTS) e resposta por voz
- Feedback detalhado com score por resposta da entrevista

## Como Rodar Localmente

### Pré-requisitos

- Node.js 18+
- Python 3.12+
- Uma chave de API da OpenAI

### Backend

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt

cp .env.example .env
# Edite .env e preencha OPENAI_API_KEY e DATABASE_URL

uvicorn main:app --reload
```

A API estará disponível em `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
# Crie o arquivo .env com:
# VITE_API_URL=http://localhost:8000
npm run dev
```

O app estará disponível em `http://localhost:5173`.

## Créditos da Equipe

Desenvolvido durante o Hackathon HB01-2026 — Programadores Sem Pátria.

- Felipe Torres
- José Nauã
- Juliecio Cedraz
- Thiago Emanuel
