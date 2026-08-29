# Clamour in the Darkness — PlayCanvas migration

This folder is the PlayCanvas integration layer for the copied Clamour project.

## Source of truth
The root `src/` and `universal-server/` are the copied implementation from the working Clamour Web repository. Do not delete them during migration. The PlayCanvas Editor layer below replaces the browser rendering/runtime boundary with PlayCanvas Entities, Components, Script Assets, Scenes and references.

## Target Editor hierarchy

```text
GameRoot
├── Systems
│   ├── GameManager
│   ├── NetworkManager
│   ├── AddressManager
│   ├── SpawnManager
│   └── PersistenceManager
├── World
│   ├── Environment
│   ├── Streets
│   ├── Buildings
│   ├── Props
│   └── Lighting
├── Player
│   ├── Character
│   ├── Camera
│   ├── Collision
│   ├── Controller
│   └── Network
└── UI
    ├── MainMenu
    ├── Login
    ├── AddressPrompt
    └── HUD
```

## Mandatory wiring

- `GameRoot` has the startup script.
- `Systems/NetworkManager` owns the real Universal Server connection.
- `Systems/AddressManager` performs Google autocomplete/place-details through the Universal Server, never by exposing Google secrets in the client.
- `Systems/SpawnManager` consumes the selected address and places the Player.
- `Player/Camera` is the active camera and owns `camera` + `audio-listener` components.
- `Player/Controller` owns movement/look/input.
- `UI/*` uses PlayCanvas Screen/Element/Button/Input DOM bridge only where necessary; the authoritative game state remains in the runtime systems.
- Persistent state remains on the Universal Server.

## ESM rules
All new Editor scripts are `.mjs` ESM scripts. Use `static scriptName` and `/** @attribute */` for Inspector configuration. Do not depend on classic-script loading order; dependencies must be explicit via imports/events.

## Security
Never commit `.env`, Google private keys, Universal Server secrets or real API tokens. The PlayCanvas client receives only public configuration and talks to the Universal Server.

## MCP handoff
The Editor MCP should import/verify the Script Assets, create the hierarchy, attach Script Components, assign Entity/Asset references, configure import maps if needed, and verify the final Scene with Play/Launcher. Source-code changes must stay in Git; Editor scene wiring belongs in PlayCanvas.
