# AI 3D Agent Platform

Plataforma de interação 3D baseada no projeto existente, mas tratada como uma experiência de agente e não como jogo.

## Arquitetura

Browser → PlayCanvas Engine → Agent Client → Backend → LLM / STT / TTS / Memória

A personagem definitiva será adicionada posteriormente. Corpo, rosto, cabelo, roupas e acessórios permanecem como módulos substituíveis.

## Migração

A branch `ai-agent-platform` é uma cópia de trabalho do projeto original. A branch `main` não é alterada por esta migração.

O objetivo é reaproveitar o que for útil do projeto original — principalmente estrutura 3D, cenas, materiais, câmera e infraestrutura técnica — e substituir progressivamente as mecânicas de jogo por sistemas de interação, conversa, voz, memória, personalização e ações da agente.

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
