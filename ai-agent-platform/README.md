# AI 3D Agent Platform

Plataforma independente para uma agente 3D interativa usando PlayCanvas Engine standalone, TypeScript e Vite.

## Arquitetura

Browser → PlayCanvas Engine → Agent Client → Backend → LLM/STT/TTS/Memória

A personagem 3D será adicionada posteriormente. O objetivo é manter corpo, rosto, cabelo, roupas e acessórios como módulos substituíveis.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Backend

```bash
npm run server
```

O backend inicial expõe `/health` e `/api/agent/message` como pontos de integração. Credenciais reais devem ficar somente no ambiente do servidor.
