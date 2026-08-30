# Clamour in the Darkness — Kilo Project Instructions

## Runtime architecture authority
The primary game runtime is **React + PlayCanvas Engine 2.x running directly in the browser**. The PlayCanvas Editor is optional authoring tooling, not the runtime and not a mandatory architectural dependency.

Before changing gameplay/runtime code, read:
- `CLAMOUR_REACT_PLAYCANVAS_ENGINE_MASTER.md`
- `PLAYCANVAS_KILO_MASTER_DIRECTIVE.md`
- `PLAYCANVAS_KILO_CONTRACT.md`
- `playcanvas/PLAYCANVAS_EDITOR_FORENSIC_SPEC.md` only when Editor integration is actually involved

## Mandatory rules
- React owns application/UI state and application-level presentation.
- PlayCanvas Engine owns the real-time 3D runtime: scene graph, rendering, camera, physics, animation, audio, particles, assets and gameplay-side 3D behavior.
- Universal Server owns persistent/server-authoritative state and protected external-service credentials.
- PlayCanvas Editor may be used for asset/scene authoring, inspection or optional workflows, but the game must not depend on the Editor being open or on Editor-only scene wiring.
- Do not force a React system, service, UI state, gameplay system or runtime manager into PlayCanvas Editor Entities/Components merely to make the project look Editor-native.
- Do not create a second renderer, physics engine, scene graph or asset system when the PlayCanvas Engine already provides the capability.
- New direct PlayCanvas Engine code uses ESM imports from `playcanvas` and current Engine 2.x APIs.
- Prefer native Engine APIs for input, physics, rendering, animation, audio, assets, entities and events.
- React must not directly own low-level per-frame 3D mutation when a dedicated PlayCanvas Engine system/component/controller is the correct owner.
- PlayCanvas Engine state must not become a duplicate React state tree. Keep one authoritative owner per state domain.
- Keep server secrets out of client/React/PlayCanvas code.

## Runtime verification
The primary completion test is:
1. `play.bat` or the normal local dev command starts the browser game.
2. React loads.
3. PlayCanvas Engine initializes successfully.
4. The game scene initializes without Editor dependency.
5. No runtime console errors occur.
6. Required server/network flows work.
7. Physics/input/rendering/asset loading behave correctly.

Editor verification is additional only when a feature intentionally uses Editor-authored assets/scenes or Editor-specific tooling.

## Git/Editor synchronization
Source code in GitHub is authoritative for runtime code. Do not assume the live Editor contains required runtime behavior. If Editor assets/scenes are deliberately used, keep their integration documented and test the standalone browser runtime as the final authority for playability.
