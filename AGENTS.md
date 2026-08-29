# Clamour in the Darkness — Kilo Project Instructions

## Authority
For PlayCanvas-owned behavior, the live PlayCanvas Editor and current PlayCanvas 2.x documentation are authoritative. Never invent a parallel engine abstraction when a native PlayCanvas capability exists.

Read before changing PlayCanvas integration:
- `PLAYCANVAS_KILO_CONTRACT.md`
- `playcanvas/PLAYCANVAS_EDITOR_FORENSIC_SPEC.md`
- `playcanvas/PLAYCANVAS_EDITOR_MANIFEST.json`
- `playcanvas/README.md`

## Mandatory rules
- Preserve the existing PlayCanvas architecture and script names unless the change explicitly migrates them.
- Use native Entities, Components, Assets, Templates, Scenes, Project Settings, Layers and Editor workflows before custom code.
- New PlayCanvas scripts are ESM `.mjs` scripts extending `Script` with `static scriptName`.
- Use typed ESM Script Attributes for Entity/Asset references and verify them in the real Inspector.
- Use native Collision/Rigid Body physics. Dynamic bodies are moved through physics APIs, not ordinary Entity transforms.
- Use PlayCanvas Keyboard/Mouse/Touch/Gamepad facilities according to enabled Project Settings.
- Prefer GLB + Import Hierarchy for editable imported 3D hierarchies.
- Do not introduce deprecated Model/Animation component dependencies in new work.
- Do not store private Google credentials, server secrets or service tokens in client assets.
- Treat GitHub as the source of source files and the live PlayCanvas project as the source of Editor scene/entity/component/asset/settings state.
- For external AI coding changes to PlayCanvas text assets, use PlayCanvas VS Code/Cursor Pull/Push mode, not Realtime mode.

## Change protocol
1. Inspect the existing source and the live Editor state when available.
2. Identify which PlayCanvas native feature owns the behavior.
3. Make the smallest coherent change.
4. Check producers/listeners and all endpoint contracts when events or networking change.
5. Parse changed scripts in the Editor so attributes refresh.
6. Review diagnostics and diff.
7. Launch the actual Scene and inspect runtime output.
8. Never report "100% compatible" from repository inspection alone.

## Clamour integration
The target hierarchy, references, events, physics requirements and server boundaries are defined in the forensic specification and manifest. Do not silently create another scene graph, input system, physics system or rendering layer.
