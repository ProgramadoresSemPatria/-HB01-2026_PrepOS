# PrepOS — Plataforma de Preparação para Entrevistas Técnicas

PrepOS é uma plataforma inteligente que ajuda desenvolvedores a se prepararem para entrevistas técnicas de forma personalizada, do upload do currículo até a simulação de entrevista por áudio.

## Problema Resolvido

Candidatos chegam a entrevistas técnicas sem saber exatamente onde estão seus gaps em relação à vaga. O PrepOS analisa o currículo e a descrição da vaga com IA, gera um match score real, monta um plano de estudo de 7 dias, recomenda problemas LeetCode relevantes, gera pitches STAR a partir das experiências do candidato e simula uma entrevista completa com feedback em tempo real.

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

| # | Feature | Descrição |
|---|---------|-----------|
| F01 | Upload & Parsing | Upload do currículo em PDF e extração de texto |
| F02 | Match Score | Score de aderência à vaga com lista de gaps |
| F03 | Navegação com Session | Guards de rota e estado persistido via Zustand |
| F04 | Roadmap de Estudo | Plano de 7 dias gerado por IA baseado nos gaps |
| F05 | Contexto por Gap | Explicação objetiva de cada skill para entrevistas |
| F06 | Problemas LeetCode | Seleção personalizada de problemas por perfil |
| F07 | Feedback de Solução | Avaliação de código com complexidade e dicas |
| F08 | Pitch STAR | Cartões de pitch gerados a partir do histórico do candidato |
| F09 | Simulador de Entrevista | Perguntas em áudio via TTS, resposta por voz |
| F10 | Avaliação de Resposta | Score e feedback detalhado por resposta |

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

| Nome | GitHub |
|------|--------|
| Felipe Torres | [@FelipeTorres](https://github.com/FelipeTorres) |
| José Nauã | [@JoseNaua](https://github.com/JoseNaua) |
| Juliecio Cedraz | [@JuliecioCedraz](https://github.com/JuliecioCedraz) |
| Thiago Emanuel | [@thiagoemanoel181](https://github.com/thiagoemanoel181) |

Repositório: [github.com/ProgramadoresSemPatria/-HB01-2026_PrepOS](https://github.com/ProgramadoresSemPatria/-HB01-2026_PrepOS)
