# @darkfantasy/engine

A modular 3D game engine built on Three.js with TypeScript.

## Features

- **Renderer** — Three.js scene management with camera and lighting support
- **Entity System** — Component-based game objects with hierarchies
- **Input Manager** — Keyboard, mouse, and event handling
- **Physics System** — Placeholder for physics simulation (ready for Cannon.js integration)
- **Audio Manager** — Sound and music management using Web Audio API
- **Asset Manager** — Resource loading and caching system
- **Event System** — Built-in event emitter for loose coupling

## Architecture

```
Engine (main orchestrator)
├── Renderer (Three.js wrapper)
├── PhysicsSystem
├── AudioManager
├── InputManager
├── AssetManager
└── Entity Tree (hierarchical game objects)
    └── Component System (behavior composition)
```

## Core Concepts

### Engine
The main class that orchestrates all subsystems. Create an engine instance to start using the framework.

```typescript
const engine = new Engine({ width: 800, height: 600 })
engine.start()
```

### Entities
Game objects that form a hierarchical tree structure. Entities contain components and can have children.

```typescript
const player = engine.createEntity('Player')
player.setPosition({ x: 0, y: 5, z: 0 })
player.addComponent(PlayerController)
```

### Components
Reusable behaviors attached to entities. Components inherit from the `Component` class.

```typescript
class PlayerController extends Component {
  update(delta: UpdateDelta) {
    // Update logic
  }
}
```

### Subsystems

#### Renderer
Access Three.js scene, camera, and renderer:
```typescript
const scene = engine.getRenderer().getScene()
const camera = engine.getRenderer().getCamera()
```

#### Input
Listen to keyboard and mouse input:
```typescript
const input = engine.getInput()
if (input.isKeyPressed('w')) {
  // Move forward
}

input.on('keydown', (event) => {
  console.log('Key pressed:', event.key)
})
```

#### Physics
Physics simulation (to be implemented):
```typescript
const physics = engine.getPhysics()
physics.update(delta)
```

#### Audio
Play sounds and music:
```typescript
const audio = engine.getAudio()
await audio.loadSound('bgm', 'assets/music.mp3')
audio.playSound('bgm', { volume: 0.5, loop: true })
```

#### AssetManager
Load and cache game assets:
```typescript
const assets = engine.getAssetManager()
const model = await assets.loadAsset('character', 'assets/character.gltf')
```

## Building

```bash
npm run build
```

Output is in the `dist/` directory.

## Package Usage

When extracted as a standalone package:

```bash
npm install @darkfantasy/engine
```

```typescript
import { Engine, Entity, Component } from '@darkfantasy/engine'

const engine = new Engine()
engine.start()
```

## Future Enhancements

- [ ] Physics integration (Cannon.js)
- [ ] GLTF/GLB model loading
- [ ] Animation system
- [ ] Particle system
- [ ] Shader system
- [ ] UI framework
- [ ] Debugging tools
