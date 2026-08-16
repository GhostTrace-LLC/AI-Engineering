# AI Engineering

A step-by-step learning path for becoming an AI Engineer using a modern TypeScript stack.

This repository follows a weekly roadmap. Each major milestone is saved with Git tags so you can review progress stage by stage.

## Stack

- **Frontend:** Nuxt 4, Vue 3, TypeScript, Nuxt UI
- **AI SDK:** Vercel AI SDK (`ai`, `@ai-sdk/vue`)
- **Local LLM:** Ollama (`gemma2:2b`, `nomic-embed-text`)
- **Cloud LLM:** xAI Grok
- **Vector Database:** Supabase (PostgreSQL + `pgvector`)
- **Backend:** NestJS
- **Storage:** Supabase Storage

## Repository Structure

```text
AI-Engineering/
├── ai-nuxt-app/     # Nuxt frontend + Nitro APIs
├── rag-api/         # NestJS RAG backend
└── README.md

How to Run
1) Nuxt app

cd ai-nuxt-app
pnpm install
pnpm dev

App: http://localhost:3000

2) NestJS API

cd rag-api
pnpm install
pnpm start:dev

API: http://localhost:3002

3) Ollama
Make sure Ollama is running and models are available:

ollama list

Required models used in this path:

gemma2:2b
nomic-embed-text

Environment Variables
Never commit real .env files.
ai-nuxt-app/.env

NUXT_SUPABASE_URL=
NUXT_SUPABASE_ANON_KEY=
NUXT_SUPABASE_SERVICE_ROLE_KEY=
XAI_API_KEY=
