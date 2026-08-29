# Clamour in the Darkness — PlayCanvas/Kilo Contract

## Authority

PlayCanvas Editor + current PlayCanvas Engine documentation are authoritative for anything that belongs to the PlayCanvas platform. Kilo must not replace native Editor functionality with parallel application code when a native PlayCanvas feature exists and is appropriate.

The Git repository contains the source-code integration layer. The live PlayCanvas project contains the authoritative scene/entity/component/asset wiring that cannot be inferred from this repository alone.

## Mandatory working model

- Scene structure is built from PlayCanvas Entities and parent/child hierarchy.
- Entity behavior is expressed with native Components first and Script Components only for game-specific behavior.
- New scripts use ESM `.mjs` and `static scriptName`.
- Script configuration that should be editable in the Editor is exposed through ESM `@attribute` fields.
- Entity references use `@attribute` plus `@type {Entity}` and import `Entity` from `playcanvas`.
- Asset references use `@attribute` plus an explicit Asset type when type inference is not possible.
- Imported 3D hierarchies use the current GLB/Import Hierarchy pipeline instead of rebuilding model trees manually in code.
- Reusable objects use Template assets where appropriate.
- Rendering, camera, light, audio, UI, collision and rigidbody behavior use native Components.
- Physics uses the PlayCanvas physics system and Ammo.js when physics is required. Dynamic rigidbodies must not be moved by directly changing Entity transforms.
- Keyboard/mouse/touch/gamepad behavior uses PlayCanvas input facilities when available rather than unrelated global listeners.
- Runtime state that must persist or synchronize belongs to Universal Server; client-side PlayCanvas scripts contain presentation/control logic, not server secrets.

## Editor areas to respect

### Toolbar
Use native scene/settings/play/version-control commands rather than creating replacement commands in application code.

### Hierarchy
The hierarchy is authoritative for parent/child relationships and transform inheritance. Do not recreate the Editor hierarchy as a second custom tree in code.

### Viewport
Use native Translate/Rotate/Scale tools and scene editing. Runtime scripts must not fight Editor-authored transforms except when runtime behavior explicitly requires it.

### Inspector
The Inspector is the primary authoring surface for Entity, Component, Script Attribute and Asset configuration. Any required cross-entity reference should be explicit in the Inspector.

### Assets
Use the Asset Panel and import pipeline for models, GLB, materials, textures, animations, audio, scripts, templates, sprites, fonts, shaders and other supported asset types.

### Project Settings
Respect these current categories:

- Engine
- Editor
- Asset Import
- Physics
- Rendering
- Layers
- Lightmapping
- Batch Groups
- Launch Page
- Input
- Localization
- Network

Do not silently encode a Project Setting as an application constant when the behavior is owned by the Editor/project configuration.

## Asset import rules

- Prefer Convert to GLB for new 3D imports.
- Use Import Hierarchy for editable imported model/entity hierarchies where appropriate.
- Preserve material mappings when reimport workflows require stable assignments.
- Use mesh compression deliberately and ensure required runtime modules are present.
- Do not confuse source model assets with generated Render, Material, Texture, Container and Template assets.

## Physics rules

- Physics requires Ammo.js to be present and physics enabled in project settings.
- A physical Entity uses Collision + Rigid Body.
- Static objects are not moved at runtime.
- Kinematic objects may be moved by transforms.
- Dynamic objects are controlled by physics. Use forces, impulses, velocity APIs or Rigidbody teleportation for explicit teleports.
- Do not use direct `Entity.translate`/`setPosition` as the normal movement mechanism for dynamic rigidbodies.
- Raycasts use the native rigidbody system for collision queries.

## Script/Inspector rules

A null-initialized ESM property is not enough to make a typed Inspector reference. When the type is required, declare it explicitly, for example:

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

The file name and the registered `static scriptName` are independent concepts. Scene Script Components must reference the registered script name.

## Clamour wiring

Expected top-level hierarchy:

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
    └── Error
```

Required references are documented in `playcanvas/PLAYCANVAS_EDITOR_MANIFEST.json`.

## Event flow

```text
UI/AddressPrompt
  -> AddressManager
  -> Universal Server Google autocomplete/place-details
  -> address:selected
  -> StreetViewManager
  -> SpawnManager
  -> player:spawn
  -> Player Controller / HUD
```

Network lifecycle:

```text
GameRoot
  -> NetworkManager
  -> Universal Server
  -> network:online / network:error
```

Authentication lifecycle:

```text
UI
  -> auth:login / auth:register
  -> AuthManager
  -> NetworkManager
  -> Universal Server
  -> auth:success / auth:error / auth:logged-out
```

## Security

Never store Google private keys, Universal Server secrets, service credentials or real API tokens in PlayCanvas Script Assets, scene attributes, import maps or the public repository.

## Source control and synchronization

Git/GitHub is authoritative for source files in this repository. PlayCanvas Editor state is authoritative for live Scene/Entity/Component/Asset wiring in the PlayCanvas project. Do not fabricate a fake local representation and assume it is equivalent to the live Editor project.

When using the PlayCanvas VS Code/Cursor integration, use the documented synchronization workflow and review diffs before Push. When using Editor MCP, inspect first, make the smallest intended change, then verify in the Editor/Launcher.

## Required verification before declaring a feature complete

1. Script assets load without Editor errors.
2. Every referenced Entity/Asset attribute is visible and correctly assigned in the Inspector.
3. Every Script Component uses the expected registered `scriptName`.
4. Every required Component exists and is configured with the correct native PlayCanvas component type.
5. Project Settings required by the feature are enabled and consistent.
6. The Scene launches successfully.
7. Runtime console contains no initialization errors.
8. Physics features have Ammo.js available when required.
9. UI events and gameplay events are actually connected.
10. The live Editor project is verified, not inferred only from repository files.

## Do not do

- Do not invent a Unity-style or Three.js-style parallel scene system.
- Do not replace native Components with custom JavaScript equivalents without a documented reason.
- Do not assume a repository folder named `playcanvas` is itself a complete exported PlayCanvas project.
- Do not claim 100% Editor compatibility without checking the live PlayCanvas project.
