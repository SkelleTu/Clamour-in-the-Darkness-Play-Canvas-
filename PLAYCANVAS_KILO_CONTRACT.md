# Clamour in the Darkness — PlayCanvas/Kilo Contract

PlayCanvas Editor + current PlayCanvas Engine documentation are authoritative for all platform-owned behavior. Kilo must use native PlayCanvas Editor/Engine features before creating custom equivalents.

## Non-negotiable architecture
- Scenes are PlayCanvas Scenes containing Entities, Components and Scene Settings.
- Hierarchy, Inspector, Assets and Viewport are authoritative Editor structures.
- Use native Components for rendering, cameras, lights, audio, UI, physics, particles, animation, sprites, GSplat and related capabilities.
- Use ESM `.mjs` Scripts with `static scriptName` for new custom gameplay behavior.
- Expose editor-facing configuration with ESM `@attribute`; use explicit JSDoc `@type` for Entity/Asset references when required.
- Imported 3D content should use the current GLB/Import Hierarchy pipeline where editable entity hierarchies are desired.
- Use Template assets for reusable entity hierarchies where appropriate.
- Use Project Settings for project-level engine/import/physics/rendering/input/network configuration instead of duplicating those settings as arbitrary application constants.
- Physics movement for dynamic rigid bodies must be performed through the physics API, not normal Entity transforms.
- PlayCanvas input facilities are authoritative when the relevant device is enabled in Project Settings.
- PlayCanvas Editor state is not equivalent to the source repository. Do not fabricate a local scene representation and call it authoritative.

## Current Editor areas
Respect the Toolbar, Hierarchy, Viewport, Inspector and Assets panels, including their native selection, transform, search, reference, copy/paste, undo/redo, asset inspection, import and launch workflows.

## Current Project Settings
Respect these categories and their real scopes:
Engine, Editor, Asset Import, Physics, Rendering, Layers, Lightmapping, Batch Groups, Launch Page, Input, Localization and Network.

## Current Components
Prefer the current components:
Anim, Audio Listener, Button, Camera, Collision, Element, GSplat, Layout Child, Layout Group, Light, Particle System, Rigid Body, Render, Screen, Script, Scrollbar, Scroll View, Sound and Sprite.
Do not introduce new dependencies on deprecated Model or Animation components.

## ESM Script Attributes
An ESM attribute must either have a typed/initialized value or an explicit JSDoc type. Entity and Asset references should use explicit types where inference is unavailable.

Example:
```js
import { Entity, Script } from 'playcanvas';

export class Example extends Script {
    static scriptName = 'example';

    /**
     * @attribute
     * @type {Entity}
     */
    target;
}
```

After changing attribute declarations, the Script Component must be parsed again in the Editor so Inspector controls refresh.

## Clamour target hierarchy
```text
GameRoot
├── Systems
│   ├── GameManager
│   ├── NetworkManager
│   ├── AuthManager
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
    ├── HUD
    ├── Loading
    └── Error
```

## Clamour wiring
- GameRoot owns startup and high-level lifecycle events.
- Systems/NetworkManager owns the Universal Server HTTP boundary.
- Systems/AuthManager owns client authentication state and server authentication calls.
- Systems/AddressManager requests Google Places data through Universal Server; Google private credentials never enter the client.
- Systems/SpawnManager reacts to address selection and controls player spawn placement.
- World/Environment/StreetView obtains Street View metadata/images through Universal Server.
- Player/Controller handles client-side player controls and delegates physical movement to the native Rigidbody where the player is dynamic.
- Player/Camera owns Camera and Audio Listener components.
- UI entities use native Screen/Element/Button/etc. components; gameplay state remains in runtime systems.
- Persistent player state is authoritative on Universal Server.

## Events
```text
clamour:boot
network:online / network:error

auth:login / auth:register / auth:logout / auth:validate
auth:success / auth:error / auth:logged-out

address:selected
player:spawn / player:ready / player:vitals

streetview:ready / streetview:error
ui:error
```

## Google / Street View
```text
UI/AddressPrompt
  -> AddressManager
  -> Universal Server /api/game/google/autocomplete
  -> Universal Server /api/game/google/place-details
  -> address:selected
  -> StreetViewManager + SpawnManager
```

## Universal Server
The client must use the server URL exposed by the NetworkManager and the route paths actually implemented by the current Universal Server. Do not assume `/api/game/status` when the health endpoint is `/api/healthz`.

## Security
Never commit or expose Google private keys, Universal Server secrets, service credentials or private API tokens in Script Assets, scene attributes, import maps or the public repository.

## Asset pipeline
Prefer the current GLB pipeline. When importing models, understand the generated Material, Texture, Template, Container and Render assets. Use Import Hierarchy for editable imported entity hierarchies when required. Preserve material mappings when reimport workflows require stable assignments. If mesh compression requires a runtime decoder such as Draco WASM, ensure the required module is actually available.

## Source control / AI workflow
For external coding assistants that modify text assets, use PlayCanvas VS Code/Cursor Pull/Push mode, not Realtime mode. Pull first, make reviewed local changes, inspect diagnostics/diff, then Push. When using Editor MCP, inspect first, make the smallest targeted Editor change, then verify in the real Editor and Launcher.

## Completion gate
Do not declare a feature complete until:
1. Script assets parse without Editor errors.
2. Required Entity and Asset attributes appear in Inspector with correct types.
3. Script Components use the registered script names.
4. Required native Components exist and are configured correctly.
5. Required Project Settings are enabled and consistent.
6. Scene launches successfully.
7. Runtime console has no initialization errors.
8. Physics has the required Ammo support when applicable.
9. Input and UI events are actually connected.
10. The live PlayCanvas project has been verified, not merely inferred from Git.

## Prohibited
- Do not build a Unity-style scene system inside TypeScript/JavaScript.
- Do not replace native PlayCanvas Components with custom equivalents without a documented platform limitation.
- Do not treat the `playcanvas/` repository folder as if it were the live Editor project.
- Do not claim 100% Editor compatibility until the live Editor project has been inspected and launched.
