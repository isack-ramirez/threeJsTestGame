# Development Guide

## Project Overview

This project contains a game engine (`@darkfantasy/engine`) built on Three.js, designed to be modular and eventually publishable as an npm package. The engine is currently scaffolded with all core systems but without implementation details.

## Architecture

### Engine Structure

```
Engine (main coordinator)
├── Renderer (Three.js wrapper)
│   └── scene, camera, WebGLRenderer management
├── InputManager (event-emitter based)
│   └── keyboard, mouse, gamepad input
├── PhysicsSystem (placeholder for physics engine)
│   └── ready for Cannon.js or similar integration
├── AudioManager (Web Audio API wrapper)
│   └── sound loading and playback
├── AssetManager (resource caching)
│   └── texture, model, and general asset loading
└── Entity Tree (hierarchical scene graph)
    └── Components (behavior composition)
```

### Core Systems

#### 1. **Entity-Component System** (`packages/engine/src/entity/`)
- `Entity.ts` — Game objects with hierarchies and component support
- `Component.ts` — Base class for all behaviors

**Current capabilities:**
- Create entities with hierarchy
- Attach components to entities
- Component lifecycle (onEnable, onDisable, update, dispose)
- Active/inactive states

**Next steps:**
- Implement component communication patterns
- Add entity querying/filtering
- Scene management shortcuts

#### 2. **Renderer** (`packages/engine/src/renderer/Renderer.ts`)
- Three.js scene setup with camera and WebGLRenderer
- Window resize handling
- Shadow map configuration

**Current capabilities:**
- Basic scene with perspective camera
- Renderer initialization and disposal
- Frame updates and rendering

**Next steps:**
- Add lighting helpers/management
- Material pooling
- Post-processing support
- Camera control helpers
- Skybox/background management

#### 3. **Input Manager** (`packages/engine/src/input/InputManager.ts`)
- Keyboard and mouse event handling
- Input state tracking

**Current capabilities:**
- Key press/release detection
- Mouse position tracking
- Mouse button detection
- Event emission for input events

**Next steps:**
- Gamepad support
- Touch input
- Input binding/mapping system
- Input UI integration

#### 4. **Physics System** (`packages/engine/src/physics/PhysicsSystem.ts`)
- Placeholder structure for physics integration

**Current capabilities:**
- Entity registration/removal
- Enable/disable toggle

**Next steps:**
- Integrate Cannon.js or similar
- Rigidbody component
- Collision callbacks
- Raycast support
- Joint system

#### 5. **Audio Manager** (`packages/engine/src/audio/AudioManager.ts`)
- Web Audio API initialization
- Sound loading and playback structure

**Current capabilities:**
- AudioContext management
- Sound caching
- Play/stop audio

**Next steps:**
- Implement actual audio loading (fetch and decode)
- Spatial audio support
- Music system with crossfading
- Audio effects (reverb, EQ, etc.)
- Integration with AssetManager

#### 6. **Asset Manager** (`packages/engine/src/assetManager/AssetManager.ts`)
- Generic asset loading and caching system

**Current capabilities:**
- Load assets with custom loaders
- Cache management
- Default JSON loader

**Next steps:**
- GLTF/GLB model loader (with Three.js GLTFLoader)
- Image/Texture loader
- Audio loader integration
- Progress tracking
- Error handling
- Dependency resolution

#### 7. **Core** (`packages/engine/src/core/`)
- `types.ts` — Shared type definitions
- `EventEmitter.ts` — Event system for loose coupling
- `index.ts` — Core exports

**Current capabilities:**
- Transform, Vec3, Quaternion types
- EngineConfig interface
- Simple event emitter

**Next steps:**
- Add more utility types
- Possibly upgrade to more robust event system
- Add logging/debugging utilities

### Main Engine Class (`packages/engine/src/Engine.ts`)

Orchestrates all subsystems:
- Initialization of all systems
- Update loop management
- Entity creation helper
- Lifecycle events (start, stop, update)
- System access methods

## Development Workflow

### 1. Building the Engine

```bash
# Build just the engine
npm run build:engine

# Or from engine directory
cd packages/engine && npm run build
```

This compiles TypeScript to `packages/engine/dist/` and generates `.d.ts` files.

### 2. Hot Reload During Development

```bash
npm run dev
```

The vite dev server will reload when you change game code. For engine changes, you'll need to rebuild:

```bash
# In another terminal
cd packages/engine && npm run watch
```

This watches engine sources and rebuilds on changes.

### 3. Using the Engine

Import from the `@darkfantasy/engine` package in `src/main.ts`:

```typescript
import { Engine, Entity, Component } from '@darkfantasy/engine'

const engine = new Engine()
const player = engine.createEntity('Player')
player.addComponent(MyComponent)
engine.start()
```

## Implementation Roadmap

### Phase 1: Core Scaffolding ✅
- [x] Project structure
- [x] TypeScript setup
- [x] All subsystem stubs
- [x] Engine orchestrator
- [x] Entity-component base

### Phase 2: Basic Implementation
- [ ] Renderer: Basic lighting and materials
- [ ] Input: Full keyboard/mouse handling
- [ ] Entity: Scene graph rendering (connect to Three.js)
- [ ] Asset Manager: Texture and model loading
- [ ] Basic components (Transform, MeshRenderer)

### Phase 3: Physics & Audio
- [ ] Physics: Cannon.js integration
- [ ] Audio: Web Audio implementation
- [ ] Physics components (RigidBody, Collider)
- [ ] Audio components (AudioSource, AudioListener)

### Phase 4: Advanced Features
- [ ] Animation system
- [ ] Particle system
- [ ] Post-processing
- [ ] UI framework
- [ ] Debugging tools

### Phase 5: Publishing
- [ ] Documentation
- [ ] Examples
- [ ] Tests
- [ ] Publish to npm

## Code Style

- Use TypeScript with strict mode enabled
- Components should be single-responsibility
- Systems should use event emitters for communication
- Avoid circular dependencies
- Keep scaffolding comments for TODOs

## Next Steps

1. **Implement Transform synchronization** — Connect Entity transforms to Three.js Object3D
2. **Create MeshRenderer component** — Basic 3D object rendering
3. **Add loaders** — Model, texture, and audio loaders
4. **Build test scene** — Verify all systems work together
