# Clamour in the Darkness — PlayCanvas Editor Forensic Specification

This document is the implementation and audit contract for the live PlayCanvas project identified by `playcanvas/PLAYCANVAS_EDITOR_MANIFEST.json`.

## 1. Authority hierarchy

1. Live PlayCanvas Editor project: authoritative for Scene, Entity, Component, Asset, Template, script-instance attributes, Project Settings, Layers, import state and Editor-side references.
2. Current PlayCanvas Engine 2.x documentation/API: authoritative for platform behavior and valid APIs.
3. Git repository: authoritative for source files and the documented integration contract.
4. Universal Server: authoritative for persistent/server-owned game state and protected external-service credentials.

A repository file named `playcanvas/` must never be treated as a serialized copy of the live PlayCanvas Editor project.

## 2. Editor interface audit map

### Toolbar

The live Editor toolbar must remain usable for: main menu, Translate, Rotate, Scale, UI Element Resize, World/Local, Snap, Focus, Undo, Redo, Lightmapper, Code Editor, Publish/Download, support links, controls/help and Settings.

Verification: each tool must operate on the currently selected target without custom application UI replacing the native Editor operation.

### Hierarchy

The live Scene must contain one Root entity and the target Clamour hierarchy. Parent/child relationships are authoritative. Reparenting must preserve world transforms according to native Editor rules unless explicitly overridden by the user's modifier behavior.

Verification: search the hierarchy; select each required entity; confirm exact names and parents; confirm duplicates do not silently replace the intended targets.

### Viewport

Verify Perspective plus the six orthographic views, native Translate/Rotate/Scale gizmos, World/Local mode, Snap, selection/focus and render/debug modes. Editor-authored transforms must not be fought by scripts except when runtime behavior intentionally owns them.

### Inspector

For every required Entity verify: enabled state, name and every required native component. For every Script Component verify script name, enabled state and all parsed attributes. Every cross-entity and asset reference must show the correct picker/type in Inspector.

After modifying ESM attributes in code, parse the Script Component again in the live Editor.

### Assets

Verify folders, search/filter, asset paths, asset IDs, tags, Type, Exclude, Preload, import-generated assets, dependency/reference checks and publish inclusion. Verify that no required runtime asset is marked Exclude and that asynchronous assets have a valid loading path.

## 3. Current native component policy

Use current PlayCanvas Components first: Anim, Audio Listener, Button, Camera, Collision, Element, GSplat, Layout Child, Layout Group, Light, Particle System, Rigid Body, Render, Screen, Script, Scrollbar, Scroll View, Sound and Sprite.

Do not introduce new dependencies on deprecated Model or Animation components.

## 4. Clamour scene contract

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

Required components:

- `Player/Camera`: Camera + Audio Listener.
- `Player/Collision`: Collision + Dynamic Rigid Body.
- `Player/Controller`: Script Component using `clamourPlayerController`.
- `World/Lighting`: native Light Component.
- UI root: Screen and child Element/Button/Input components as needed.

## 5. Entity reference contract

Every Script Attribute that points to an Entity uses ESM syntax with an explicit `@type {Entity}` when its type cannot be inferred.

Every Script Attribute that points to an Asset uses an explicit asset type when inference is insufficient.

Verification must be performed in the real Inspector. A TypeScript/JSDoc declaration alone is not proof that the live Editor instance is assigned.

## 6. Asset import contract

For new model content:

1. Prefer Convert to GLB.
2. Use Import Hierarchy when editable model sub-hierarchies are required.
3. Verify generated Material, Texture, Template, Container and Render assets.
4. Verify material mappings after reimport.
5. Use mesh compression deliberately.
6. If using Draco compression, verify the required decoder WASM asset is present and published.
7. For animation imports verify naming strategy, sample rate, curve tolerance and cubic-curve behavior.

When the source model changes, verify that the resulting Template update preserves required added Components and script-driven entities according to the native matching rules.

## 7. Physics contract

Physics must be enabled in Project Settings and Ammo.js must be available when required.

Dynamic Player:
- Collision defines the physical shape.
- Rigid Body type is Dynamic.
- Normal movement changes `rigidbody.linearVelocity` or other native physics APIs.
- Teleportation uses `rigidbody.teleport`.
- Do not use normal Entity `setPosition`, `translate`, `setEulerAngles` or equivalent as the movement mechanism for a dynamic body.
- Grounding checks use native rigidbody raycast facilities.

Kinematic objects may use Entity transforms according to native physics behavior.

## 8. Input contract

Project Settings must enable Keyboard and Mouse. Touch and Gamepads are enabled when the target device matrix requires them.

The Player Controller uses PlayCanvas Keyboard and Mouse devices and PlayCanvas pointer lock. Browser-global input listeners must not be introduced when an equivalent PlayCanvas input facility exists.

## 9. Rendering contract

Rendering behavior owned by the platform belongs in Project Settings and native Components. Verify Engine/WebGL2/WebGPU choice, resolution/pixel ratio, tone mapping/exposure, fog, skybox, clustered lighting, shadows, render layers, materials, lights and cameras against the actual project requirements.

## 10. Layers contract

Use the live Layer settings to define rendering order. Verify required default layers remain valid: World, Depth, Skybox, Immediate and UI. Additional custom layers must be documented and referenced explicitly by renderable Components.

## 11. Lighting / lightmapping / batching

Verify Light components and project Lightmapping settings before baking. Verify Batch Groups where used and ensure batch IDs/settings are consistent with intended draw-call optimization. Do not create a custom batching system that competes with native Batch Groups without a documented reason.

## 12. UI contract

UI is authored using native Screen, Element, Button, Layout Group, Layout Child, Scroll View and Scrollbar components where applicable. HTML/DOM is only used where native PlayCanvas UI does not satisfy the requirement.

The Clamour UI state machine is:

```text
boot -> Loading
online -> Login OR session validation
login success -> AddressPrompt
address selected -> Loading
player spawn -> HUD
network error -> Error
logout -> Login
```

## 13. Animation contract

Use native Anim Component + Animation State Graph for new character/entity animation workflows. Imported animation assets must be validated in the Asset Inspector and assigned through the live Editor.

## 14. Audio contract

Camera/listener placement is owned by the Audio Listener Component. Sound playback uses Sound Components and audio assets. Do not implement an independent positional audio engine when native PlayCanvas audio components suffice.

## 15. Particle and environment effects

Use Particle System for rain, dust, fog-like particles and similar effects when appropriate. Verify Space, Bounds/Wrap, Local Space, Screen Space, Orientation and Layers settings in Inspector.

## 16. GSplat / photogrammetry path

GSplat is a native rendering component. Verify the GSplat asset type, shadows, LOD base distance, LOD multiplier and Layers when Gaussian Splat content is used. Do not treat a GSplat scene as a generic mesh scene.

## 17. Scene loading

Scenes are the authoritative 3D world containers. Verify which Scene is the launch/start scene and test loading of any additional scenes dynamically through the Engine APIs. Scene dependencies must resolve before declaring the feature complete.

## 18. Templates

Use Templates for reusable entity hierarchies. Imported model hierarchies may generate Template assets. Verify instances after template updates.

## 19. Project Settings audit matrix

Every live project must be checked under:

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

For every setting, record: current value, intended value, scope (user/session or branch/project), reason, dependent features, and whether a change requires a relaunch/reimport/rebake.

## 20. Launch and runtime verification

A feature is not complete when files compile. It is complete only when the live Editor launches the Scene and the runtime behaves correctly.

Verification sequence:

1. Open the intended Scene.
2. Confirm hierarchy and required entities.
3. Inspect required components.
4. Parse all modified scripts.
5. Verify script attributes and references.
6. Launch.
7. Inspect runtime console.
8. Verify network health and authentication.
9. Verify address selection.
10. Verify Street View response.
11. Verify player spawn.
12. Verify keyboard/mouse movement.
13. Verify physics collisions and grounding.
14. Verify UI state transitions.
15. Verify persistence request and server response.
16. Verify no 4xx/5xx requests except intentionally handled failures.
17. Verify no missing assets.
18. Verify no deprecated component introduced by the change.

## 21. Git / PlayCanvas synchronization

Source files in GitHub are not a substitute for live Editor state. When using the PlayCanvas VS Code/Cursor extension with an external coding agent, use Pull/Push mode. Pull the latest remote text assets before editing, review the diff, then Push. Use the live Editor for Entity/Component/Scene/Project Setting state.

## 22. Kilo behavior

Kilo must:

- inspect the existing repository before modifying it;
- follow this contract;
- prefer native PlayCanvas Components and settings;
- preserve the existing hierarchy and script names unless a migration explicitly changes them;
- never create parallel Three.js, Unity-style or DOM scene systems to replace native Editor behavior;
- never assume `playcanvas/` is the serialized live project;
- verify dependent producers/listeners when changing event contracts;
- verify endpoint paths against the current Universal Server implementation;
- make the smallest coherent change;
- inspect diagnostics and diff before synchronization;
- never claim 100% compatibility based only on source files.

## 23. Known current-version reference

The repository currently targets PlayCanvas 2.21.4 in its import map. The current npm latest stable release is 2.21.4 as of this audit; beta/alpha releases must not be adopted automatically. Any future Engine upgrade requires a deliberate compatibility audit.

## 24. Live Editor certification gate

The final certification is either:

`CERTIFIED — LIVE EDITOR VERIFIED`

or:

`NOT CERTIFIED — LIVE EDITOR STATE NOT VERIFIED`

Never replace the second status with a guess.
