# AI 3D Agent — contrato da plataforma

## Experiência
A aplicação é uma plataforma de interação 3D. O PlayCanvas é o motor de renderização e simulação; não é necessário usar o Editor PlayCanvas para operar a experiência.

## Sistemas principais

### Agent
Responsável por personalidade, contexto, memória, conversa e decisão de ações.

### Conversation
Transporta mensagens entre usuário e agente. Texto e voz são canais da mesma conversa.

### Voice
STT converte voz do usuário em entrada; TTS ou realtime audio entrega a resposta falada. O provedor deve ser substituível.

### Memory
Memória persistente deve ficar no backend. O cliente nunca recebe chaves privadas nem acesso direto ao armazenamento sensível.

### Avatar
O avatar futuro é modular:
- corpo base
- cabeça/rosto
- cabelo
- olhos e expressões
- roupa superior
- roupa inferior
- calçados
- acessórios

### Actions
A agente pode emitir ações estruturadas independentes da fala:
- idle
- look_at
- talk
- gesture
- walk
- sit
- stand
- emote
- change_outfit

## Regra de separação
O texto que a agente fala não deve ser usado como protocolo de animação. A resposta deve possuir fala e ações em campos separados para permitir sincronização posterior.

## Compatibilidade
A plataforma deve funcionar em navegador desktop e, sempre que o desempenho permitir, em dispositivos móveis.
