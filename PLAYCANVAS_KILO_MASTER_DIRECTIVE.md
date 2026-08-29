# CLAMOUR IN THE DARKNESS — PLAYCANVAS KILO MASTER DIRECTIVE

Status: AUTHORITATIVE PROJECT INSTRUCTION
Target: PlayCanvas Engine 2.x / Editor live project 2582233
Repository: `SkelleTu/Clamour-in-the-Darkness-Play-Canvas-`

## 0. NON-NEGOTIABLE PRINCIPLE

PlayCanvas is the game platform, editor, scene graph, component system, asset pipeline, renderer, physics integration, input layer, UI layer, animation system and project-configuration authority.

Kilo is an implementation agent. Kilo does not replace PlayCanvas with a custom engine, scene graph, renderer, physics system, asset manager, editor abstraction or duplicated configuration layer.

The live PlayCanvas Editor is authoritative for live Scene/Entity/Component/Asset/Template/Project-Setting state. GitHub is authoritative for source files and this contract. Universal Server is authoritative for persistent/server-owned state and protected credentials.

Never claim a live Editor feature works merely because equivalent source code exists.

## 1. READ ORDER BEFORE ANY WORK

Before changing anything:

1. Read this file.
2. Read `AGENTS.md`.
3. Read `PLAYCANVAS_KILO_CONTRACT.md`.
4. Read `playcanvas/PLAYCANVAS_EDITOR_FORENSIC_SPEC.md`.
5. Read `playcanvas/PLAYCANVAS_EDITOR_MANIFEST.json`.
6. Read `playcanvas/README.md`.
7. Inspect the target source file and all direct producers/consumers.
8. Inspect the live PlayCanvas Editor project when access is available.
9. Inspect the Universal Server endpoint when networking is involved.
10. Only then modify code or Editor state.

Never start by creating a new scene architecture because an existing one was not immediately found.

## 2. NATIVE-FIRST DECISION TREE

For every requested feature ask, in order:

A. Is it already a native PlayCanvas Editor capability?
- Use the Editor.

B. Is it a native Entity Component capability?
- Add/configure the native Component.

C. Is it an Asset Pipeline operation?
- Use the Asset Pipeline and verify the generated assets.

D. Is it project-wide behavior?
- Use Project Settings.

E. Is it reusable entity structure?
- Use Templates.

F. Is it imported 3D structure?
- Use GLB/GLTF and Import Hierarchy where appropriate.

G. Is it game-specific behavior not supplied natively?
- Implement an ESM Script Component.

H. Is it server-owned data or protected integration?
- Keep it on Universal Server.

I. Does the change require editing live Editor state that cannot be represented safely as a text asset?
- Use the live Editor or official Editor MCP.

Do not proceed to custom code while a suitable native mechanism exists without documenting why the native mechanism is insufficient.

## 3. EDITOR INTERFACE CONTRACT

Treat the following Editor areas as real authoring systems, not decoration.

### Toolbar

Preserve and use native controls for menu, Translate, Rotate, Scale, UI Element Resize, World/Local, Snap, Focus, Undo, Redo, Lightmapper, Code Editor, Publish/Download, help/controls and Settings.

Do not make application UI that pretends to be the Editor toolbar.

### Hierarchy

Hierarchy is authoritative for parent/child relationships, entity ownership and transform inheritance.

Rules:
- Preserve intended root and parentage.
- Do not create a second JavaScript-only hierarchy.
- Do not silently rename required entities.
- Do not use code to rebuild static hierarchy every boot.
- Reparent in Editor when the relationship is authoring data.
- Runtime reparenting is allowed only for actual runtime behavior.

### Viewport

Use native selection, navigation, Perspective/orthographic views, Translate/Rotate/Scale, World/Local, Snap, Focus and visual/debug inspection.

Never write runtime code whose sole purpose is to reproduce Editor gizmos or scene authoring.

### Inspector

Inspector is authoritative for component configuration and script attributes.

For every modified Script Component:
- Parse/reload the script in the Editor.
- Confirm attributes appear.
- Confirm the correct type picker appears.
- Confirm references are assigned.
- Confirm enabled state.
- Confirm values match the intended contract.

A JSDoc attribute in a file is not proof that the live Editor instance is configured.

### Assets

Use native Asset Panel operations and inspect Type, path, tags, preload/exclude state, imported/generated dependencies, templates, materials, textures, animations, audio and script assets.

Never invent a fake asset registry in application code.

## 4. ENTITY AND COMPONENT RULES

Every gameplay object that belongs to the PlayCanvas scene model should be represented by an Entity and native Components whenever appropriate.

Native-first Components include current supported workflows for:
- Anim
- Audio Listener
- Button
- Camera
- Collision
- Element
- GSplat
- Layout Child
- Layout Group
- Light
- Particle System
- Rigid Body
- Render
- Screen
- Script
- Scrollbar
- Scroll View
- Sound
- Sprite

Do not add new dependencies on deprecated Model or Animation components.

Before adding a custom script, verify that the desired behavior is not already provided by a native Component or Editor feature.

## 5. SCRIPT STANDARD

All new PlayCanvas scripts are ESM `.mjs` scripts extending `Script` and using `static scriptName`.

Use explicit imports from `playcanvas`.

Entity attributes must use explicit typing when required:

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

Asset attributes must use an explicit Asset type where inference is insufficient.

Rules:
- No classic-script registration in new code.
- No hidden dependency on script load order.
- Use imports/events for dependencies.
- Use lifecycle methods correctly.
- Remove event listeners in `destroy`.
- Do not keep stale references after entity destruction.
- Avoid per-frame allocations.
- Guard optional references.
- Surface configuration through Inspector attributes when it is authoring data.

## 6. EVENT CONTRACT

Every event has:
- one canonical name;
- defined payload shape;
- known producer(s);
- known consumer(s);
- cleanup behavior.

Before changing an event name or payload:
1. Search all producers.
2. Search all listeners.
3. Update every consumer.
4. Update documentation/manifest.
5. Run source validation.
6. Verify runtime event flow.

Do not create duplicate event names for the same semantic operation.

Current Clamour canonical flows:

```text
clamour:boot
network:online / network:error
clamour:server-online / clamour:server-error
auth:login / auth:register / auth:logout / auth:validate
auth:success / auth:error / auth:logged-out
address:selected
player:spawn / player:ready / player:vitals
streetview:ready / streetview:error
ui:error
```

Do not silently rename these.

## 7. CURRENT CLAMOUR HIERARCHY

The expected live hierarchy is:

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

Do not duplicate these nodes merely because an existing node is difficult to find. Search the hierarchy first.

## 8. REQUIRED CLAMOUR COMPONENTS

`Player/Camera`:
- Camera
- Audio Listener

`Player/Collision`:
- Collision
- Dynamic Rigid Body

`Player/Controller`:
- Script Component using `clamourPlayerController`

`World/Lighting`:
- native Light Component

UI root:
- Screen
- Element/Button/Input and supporting native UI components as required.

Every required reference listed in `playcanvas/PLAYCANVAS_EDITOR_MANIFEST.json` must exist in the live Inspector.

## 9. PHYSICS CONTRACT

Enable physics and ensure Ammo.js availability whenever physics is required.

Dynamic bodies:
- Collision defines shape.
- Rigid Body defines physical body.
- Normal movement uses rigidbody physics APIs such as velocity/forces/impulses.
- Teleport uses the rigidbody teleport mechanism.
- Do not use ordinary `setPosition`, `translate` or similar Entity transforms as the normal movement system for dynamic bodies.
- Ground checks use native rigidbody raycast facilities.

Kinematic bodies can use transform-driven behavior appropriate to native PlayCanvas physics semantics.

When changing physics, inspect:
- body type;
- mass;
- friction;
- restitution;
- linear/angular damping;
- collision group/mask;
- shape size/offset;
- simulation enabled state;
- gravity;
- raycast behavior.

Do not write a replacement physics engine.

## 10. INPUT CONTRACT

Use enabled PlayCanvas input devices:
- Keyboard
- Mouse
- Touch when required
- Gamepad when required

Use PlayCanvas pointer-lock facilities for first-person mouse look.

Do not use window/document input listeners where an equivalent PlayCanvas input facility exists.

Before adding a binding:
- inspect Project Settings/Input;
- check existing bindings;
- use canonical PlayCanvas key constants where applicable;
- avoid duplicated listeners;
- remove listeners in `destroy`.

## 11. CAMERA CONTRACT

Camera behavior is split:
- Editor config: Camera Component, layers, clear/render settings, FOV and related authored settings.
- Runtime behavior: movement/look/target changes.

Do not create a parallel renderer or camera abstraction.

Verify:
- active camera behavior;
- priority/order where relevant;
- layers;
- aspect ratio behavior;
- near/far clip;
- FOV;
- audio listener alignment;
- post-processing dependencies.

## 12. RENDERING CONTRACT

Use native Rendering Project Settings and Components.

Audit when changing visuals:
- engine backend/WebGL2/WebGPU;
- resolution;
- pixel ratio;
- antialiasing;
- tone mapping;
- exposure;
- fog;
- skybox;
- clustered lighting;
- shadows;
- layers;
- materials;
- render component state;
- camera state.

Do not duplicate project rendering configuration as unrelated runtime constants.

## 13. LAYERS CONTRACT

Treat Layer settings as authoritative render ordering/visibility configuration.

Verify default layers before editing. Custom layers must have documented purpose and explicit component references.

When a Render, Camera, Light, GSplat or UI element changes visibility, inspect layer membership before writing custom visibility logic.

## 14. ASSET PIPELINE CONTRACT

For new 3D content:
1. Prefer GLB/GLTF and the current import pipeline.
2. Use Import Hierarchy when editable entity sub-hierarchy is needed.
3. Inspect generated Render/Material/Texture/Container/Template assets.
4. Verify material assignments after reimport.
5. Verify compression choices.
6. Verify Draco decoder requirements when used.
7. Verify animation import settings and naming.
8. Verify Preload/Exclude state.
9. Verify all runtime dependencies are publishable.

Never manually recreate generated imported asset structure in scripts merely to compensate for an import mistake.

## 15. TEMPLATES

Use Template assets for reusable entity hierarchies.

Rules:
- Do not duplicate large reusable hierarchies manually.
- Verify Template instances after updates.
- Do not modify generated import structure blindly.
- Check whether a change belongs to source model, imported Template, or instance override.

## 16. ANIMATION CONTRACT

Use current Anim Component + Animation State Graph workflows for new character/entity animation.

Verify:
- Anim Component state;
- State Graph asset;
- animation asset assignment;
- transitions;
- speed/blend parameters;
- layer/priority behavior;
- imported animation naming and sample settings.

Do not introduce deprecated Animation component dependencies.

## 17. AUDIO CONTRACT

Use Audio Listener on the active listening entity/camera.

Use Sound Components and audio assets for positional/native playback where suitable.

Verify:
- listener location;
- sound asset;
- slot/name;
- volume/pitch;
- loop;
- positional settings;
- attenuation;
- asset preload.

Do not make a second positional audio engine without a documented platform limitation.

## 18. UI CONTRACT

Prefer native Screen + Element + Button + Layout Group + Layout Child + Scroll View + Scrollbar components.

HTML/DOM is permitted only when native UI cannot satisfy the exact requirement, and it must not become a replacement scene/UI system.

Current Clamour state machine:

```text
boot
  -> Loading
online
  -> Login OR session validation
auth success
  -> AddressPrompt
address selected
  -> Loading
player spawn
  -> HUD
network error
  -> Error
logout
  -> Login
```

For every UI element verify actual Entity/component hierarchy and input wiring in the live Editor.

## 19. PARTICLES / ENVIRONMENT

Use native Particle System for appropriate rain, dust and environmental particle effects.

When used, inspect:
- emitter settings;
- local/world/screen space;
- orientation;
- lifetime;
- velocity;
- bounds/wrapping;
- layers;
- material/texture.

Do not create a particle engine in script.

## 20. GSPLAT / PHOTOGRAMMETRY

When Gaussian Splat content is used, use the native GSplat workflow.

Verify:
- asset type;
- GSplat Component;
- shadows;
- LOD base distance;
- LOD multiplier;
- layers;
- runtime asset loading.

Do not treat Gaussian Splat assets as ordinary meshes.

## 21. LIGHTING / LIGHTMAPPING / BATCHING

Use native Light Components.

Before lightmapping:
- inspect Lightmapping settings;
- verify light types/settings;
- verify static/authoring assumptions;
- bake deliberately;
- inspect resulting visuals.

Use native Batch Groups when appropriate. Do not implement competing draw-call batching without a measured, documented reason.

## 22. SCENE CONTRACT

Scenes are authoritative world containers.

Before modifying a scene:
- confirm active/launch scene;
- confirm dependencies;
- search for existing entities;
- inspect scene settings;
- avoid duplicate global systems.

Dynamic scene loading must use Engine-supported scene loading and preserve required asset dependencies.

## 23. PROJECT SETTINGS MATRIX

Every relevant change must consider:
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

For every changed setting record mentally or in documentation:
- old value;
- new value;
- scope;
- reason;
- dependent features;
- whether reimport/rebake/relaunch is required.

Do not encode a Project Setting as a magic JavaScript constant when the platform owns that setting.

## 24. NETWORKING AND UNIVERSAL SERVER

The PlayCanvas client communicates with Universal Server.

Client:
- public configuration only;
- auth token handling;
- UI/control state;
- presentation;
- runtime game behavior.

Server:
- persistent state;
- protected API credentials;
- external-service calls requiring secrets;
- authoritative player data;
- protected Google integrations.

Never store Google private keys, server secrets, service credentials or real private tokens in:
- Script Assets;
- scene attributes;
- import maps;
- source repository.

Current server boundaries include:
- health;
- auth;
- player state;
- Google/Places;
- Street View;
- multiplayer;
- persistent cache/data.

When editing a client endpoint:
1. locate actual server route;
2. verify HTTP method;
3. verify path;
4. verify auth requirements;
5. verify request body/query shape;
6. verify response shape;
7. update client and server together if needed;
8. test a real request.

Never infer an endpoint from a filename or old documentation.

## 25. CURRENT CLAMOUR NETWORK FLOW

```text
GameRoot
  -> NetworkManager
  -> Universal Server
  -> network:online / network:error
```

Authentication:

```text
UI
  -> auth:login / auth:register / auth:validate / auth:logout
  -> AuthManager
  -> NetworkManager
  -> Universal Server
  -> auth:success / auth:error / auth:logged-out
```

Address:

```text
UI/AddressPrompt
  -> AddressManager
  -> Universal Server Google autocomplete/place-details
  -> address:selected
```

Location:

```text
address:selected
  -> StreetViewManager
  -> Universal Server Street View metadata/image
```

Spawn:

```text
address:selected
  -> SpawnManager
  -> Player
  -> player:spawn
```

UI:

```text
player:spawn
  -> HUD
```

Persistence:

```text
Runtime state
  -> PersistenceManager
  -> Universal Server player state
```

Do not reorder or bypass these flows unless deliberately redesigning the architecture.

## 26. STREET VIEW CONTRACT

Street View is obtained through Universal Server, never by exposing the Google key to the client.

The client requests metadata using the selected address coordinates, receives panorama metadata, then constructs an image request through the server.

Verify:
- selected coordinates;
- Araras restriction;
- server endpoint;
- response shape;
- panorama identifier;
- location;
- image parameters;
- runtime image loading;
- failure handling.

Do not store fetched imagery permanently in an asset slot without checking licensing, cache policy and project requirements.

## 27. ADDRESS / GOOGLE CONTRACT

AddressManager uses a session token for autocomplete and sends requests to the Universal Server.

Verify:
- minimum input length;
- locale/region constraints;
- Araras-only behavior where configured;
- placeId handling;
- place details response;
- coordinate validity;
- canonical `address:selected` event.

Do not call Google private APIs directly from PlayCanvas client code when the server is the protected integration boundary.

## 28. AUTH CONTRACT

Authentication uses the server as authority.

Verify:
- login request;
- register request;
- session validation;
- token storage behavior;
- playerId storage;
- logout cleanup;
- unauthorized response handling.

Do not treat localStorage as authoritative account data. It is only client session storage.

## 29. PERSISTENCE CONTRACT

Persistent player state belongs to Universal Server.

Client persistence logic must:
- avoid saving before a valid session exists;
- send valid JSON object state;
- use authenticated server route;
- avoid excessive request frequency;
- handle failures without breaking gameplay;
- not silently overwrite unrelated server data.

When expanding state, verify server validation/merge semantics first.

## 30. VERSION CONTROL CONTRACT

Two distinct systems exist:

Git/GitHub:
- source files;
- contracts;
- automation;
- server/client code.

PlayCanvas Version Control:
- live Editor project state;
- checkpoints;
- branches/merges within PlayCanvas.

Do not claim Git contains the entire live Editor project unless an actual exported artifact proves it.

Before significant live Editor changes, checkpoint the PlayCanvas project when appropriate.

## 31. EXTERNAL CODING AGENT WORKFLOW

For file changes with PlayCanvas VS Code/Cursor integration, use the documented Pull/Push workflow for external agents.

Do not use Realtime synchronization as a substitute for controlled agent edits when the workflow requires review.

Required cycle:

```text
Pull latest
  -> inspect
  -> edit
  -> local/source validation
  -> diff review
  -> Push
  -> inspect live Editor
  -> Launch
  -> runtime verification
```

## 32. EDITOR MCP WORKFLOW

When Editor MCP is available, use it for live Editor state that cannot safely be expressed only in source files.

Preferred cycle:

```text
READ
  -> identify exact target
  -> inspect existing state
  -> minimal mutation
  -> re-read
  -> Launch
  -> inspect runtime
```

Do not blindly mutate the live project from natural-language assumptions.

## 33. IMPORT / REIMPORT PROCEDURE

When changing an imported model:

1. identify source asset;
2. identify imported generated assets;
3. understand whether Import Hierarchy is active;
4. check template/generated hierarchy;
5. change source/import settings;
6. reimport;
7. inspect resulting hierarchy;
8. inspect material assignments;
9. inspect components/instances;
10. verify no required references broke;
11. Launch if runtime affected.

## 34. SCRIPT CHANGE PROCEDURE

When changing an ESM Script:

1. inspect script consumers;
2. update source;
3. verify syntax and imports;
4. verify `static scriptName` unchanged unless deliberately migrated;
5. parse the Script Component in the Editor;
6. verify attributes;
7. verify references;
8. inspect diagnostics;
9. Launch;
10. test relevant behavior.

## 35. COMPONENT CHANGE PROCEDURE

When adding/removing/modifying a native Component:

1. inspect current Entity;
2. confirm native Component is the correct mechanism;
3. configure it in Inspector;
4. verify dependent scripts;
5. verify Layers/assets/settings;
6. Launch;
7. test behavior.

Do not approximate native component settings with custom variables.

## 36. ABSOLUTE PROHIBITIONS

Never:
- create a Three.js scene parallel to the PlayCanvas Scene;
- create a Unity-style prefab system parallel to Templates;
- create a custom physics engine parallel to RigidBody/Collision;
- create a custom asset registry parallel to Asset Registry;
- recreate the Editor hierarchy in application state;
- implement a custom camera renderer instead of Camera Components;
- implement DOM UI as the default replacement for native UI;
- create classic-script dependencies in new work;
- introduce deprecated Model/Animation component dependencies;
- move dynamic rigidbodies using ordinary transform mutation as normal movement;
- hide required Inspector configuration inside constants;
- hardcode private credentials;
- claim live Editor certification from repository inspection;
- delete existing architecture without first tracing consumers and references;
- silently rename scriptName values;
- silently change endpoint contracts.

## 37. ERROR HANDLING

Every external operation must fail explicitly.

Handle:
- missing entity reference;
- missing asset;
- missing Script Component;
- missing native Component;
- unavailable server;
- HTTP 4xx/5xx;
- invalid JSON;
- malformed coordinates;
- missing authentication;
- missing physics system;
- missing input device;
- missing animation/asset dependency;
- runtime initialization errors.

Do not swallow errors with empty catch blocks.

## 38. PERFORMANCE RULES

Prefer native engine facilities and data-oriented patterns already provided by PlayCanvas.

Avoid:
- per-frame allocations;
- repeated hierarchy searches in `update`;
- repeated asset lookups when references can be cached;
- unnecessary DOM work;
- duplicate network polling;
- loading full-world assets when streaming/lazy loading is appropriate;
- custom systems that duplicate engine work.

Profile before introducing complexity for optimization.

## 39. SECURITY RULES

Treat client code as public.

Anything in:
- `.mjs`;
- scene attributes;
- public assets;
- import maps;
- browser storage

must be assumed visible to users.

Never put a private credential there.

Use server authorization for authoritative operations.

## 40. REQUIRED VALIDATION BEFORE DECLARING DONE

A feature is not complete when TypeScript/JavaScript parses.

Minimum gates:

1. Source contract validation passes.
2. Modified scripts parse successfully in PlayCanvas Editor.
3. Script names match Script Components.
4. All typed Entity/Asset attributes appear correctly.
5. All Inspector references are assigned.
6. Required native Components exist.
7. Required Project Settings are correct.
8. Required Assets are present and publishable.
9. Required Scene is correct.
10. Launch succeeds.
11. Runtime console has no unexpected initialization errors.
12. Relevant UI flow works.
13. Relevant input works.
14. Relevant physics works.
15. Relevant network requests work.
16. Server response contracts match the client.
17. No missing runtime assets.
18. No newly introduced deprecated Component dependency.
19. Diff contains only intended changes.
20. Live Editor state is re-read after mutation.

## 41. CERTIFICATION LANGUAGE

Only use one of these statuses:

`SOURCE VERIFIED`

or:

`LIVE EDITOR VERIFIED`

or:

`NOT CERTIFIED — LIVE EDITOR STATE NOT VERIFIED`

Never use “100% compatible”, “guaranteed”, “works perfectly” or equivalent unless the stated verification gates actually passed.

## 42. KILO RESPONSE DISCIPLINE

Before editing, Kilo should identify:
- requested behavior;
- native PlayCanvas owner;
- affected Scene/Entity/Component/Asset/Setting;
- affected scripts;
- affected server endpoint(s);
- likely side effects.

After editing, Kilo should report:
- files changed;
- live Editor entities/components/settings changed;
- tests/validation performed;
- runtime verification performed;
- remaining unverified state.

Do not invent successful Editor operations that were not performed.

## 43. CURRENT TARGET

The existing source integration targets PlayCanvas Engine 2.x with import map pinned to 2.21.4. Do not upgrade the Engine automatically. Any Engine upgrade requires a deliberate migration/audit and live Editor verification.

The existing PlayCanvas wiring manifest is the canonical map for this project's current intended hierarchy and script references.

END OF MASTER DIRECTIVE.
