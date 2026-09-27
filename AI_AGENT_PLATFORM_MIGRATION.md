# AI 3D Agent — Migração do jogo para plataforma de interação

Esta branch é uma cópia de trabalho baseada no projeto existente. O `main` permanece preservado.

## Objetivo
Transformar a experiência PlayCanvas em uma plataforma 3D de interação com uma agente de IA, em vez de um jogo tradicional.

## Arquitetura-alvo
- PlayCanvas Engine standalone
- TypeScript + Vite
- Interface web própria, sem dependência do Editor PlayCanvas
- Backend separado para IA, memória, sessões e voz
- Adaptador de LLM substituível
- STT/TTS e, posteriormente, voz em tempo real
- Protocolo de ações para animação, olhar, fala, emoções e locomoção
- Assets da personagem modulares: corpo, rosto, cabelo, roupas, calçados e acessórios
- Chaves de API somente no backend

## Regras da migração
1. Não alterar a branch `main` nesta etapa.
2. Preservar assets úteis do projeto original que possam ser reaproveitados como cenário, câmera, materiais ou infraestrutura técnica.
3. Remover gradualmente mecânicas específicas de gameplay que não façam sentido para a plataforma de interação.
4. Não criar a personagem definitiva ainda.
5. Deixar pontos de entrada claros para conectar posteriormente o modelo 3D modular.
6. Manter a aplicação executável via navegador e preparada para desktop e dispositivos móveis.

## Próximas camadas
- Shell da aplicação e navegação
- Runtime PlayCanvas
- Scene/room system
- Avatar system
- Conversation system
- Voice system
- Memory system
- Agent action protocol
- Personalization/configuration
- Backend/API gateway
