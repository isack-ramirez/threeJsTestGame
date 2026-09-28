# Engine Architecture

## System Overview

### Class Hierarchy

```
Engine (main coordinator)
  ├─ Renderer
  │  └─ Three.js Scene, Camera, WebGLRenderer
  ├─ InputManager (extends EventEmitter)
  │  └─ Keyboard, Mouse, Gamepad state
  ├─ PhysicsSystem
  │  └─ Physics bodies, collision detection
  ├─ AudioManager (extends EventEmitter)
  │  └─ AudioContext, Audio sources
  ├─ AssetManager
  │  └─ Cached resources (textures, models, etc)
  └─ Entity (root scene graph)
     ├─ Entity (children)
     │  └─ Component []
     │     ├─ Component.update()
     │     ├─ Component.onEnable()
     │     └─ Component.onDisable()
     └─ ...
```

## Data Flow

```
Engine.start()
  ├─ requestAnimationFrame loop
  ├─ Calculate deltaTime
  ├─ PhysicsSystem.update(delta)
  ├─ Entity.update(delta)
  │  ├─ Component.update(delta) [all components]
  │  └─ Child entities recursively
  ├─ Renderer.render(delta)
  │  └─ WebGLRenderer.render(scene, camera)
  └─ emit('engine:update', delta)
```

## Event Flow

```
Input Event
  └─ InputManager.emit()
     └─ Engine.on('input:keydown', handler)

Audio Event
  └─ AudioManager.emit()
     └─ Engine.on('audio:play', handler)

Physics Event
  └─ PhysicsSystem (future events)
     └─ Engine.on('physics:collision', handler)
```

## Component System

```typescript
class MyComponent extends Component {
  constructor(entity: Entity) {
    super(entity)
  }

  onEnable() {
    // Called when component is added or entity becomes active
  }

  update(delta: UpdateDelta) {
    // Called every frame
    const entity = this.getEntity()
    const transform = entity.getTransform()
  }

  onDisable() {
    // Called when component is removed or entity becomes inactive
  }

  dispose() {
    // Cleanup resources
  }
}
```

## Entity Hierarchy

```typescript
const root = engine.getRootEntity()     // "Root"
const player = engine.createEntity('Player')
const weapon = engine.createEntity('Weapon')

player.addChild(weapon)                 // Weapon is child of Player
weapon.setPosition({ x: 2, y: 0, z: 0 }) // Relative to player

// Hierarchy:
// Root
// └─ Player
//    └─ Weapon
```

## Transform System

Each Entity has a Transform with:
- **position** (Vec3) — Local position relative to parent
- **rotation** (Quaternion) — Local rotation
- **scale** (Vec3) — Local scale

```typescript
entity.setPosition({ x: 0, y: 5, z: 0 })
entity.setRotation({ x: 0, y: 0, z: 0, w: 1 })
entity.setScale({ x: 1, y: 1, z: 1 })
```

## System Integration Points

### Renderer Integration
```typescript
// Current: Standalone Three.js
// TODO: Bridge Entity transforms to Three.js Object3D
```

### Physics Integration (Placeholder)
```typescript
// Current: Empty system
// TODO: Integrate Cannon.js or similar
// Components: RigidBody, Collider, Joint
```

### Audio Integration (Partial)
```typescript
// Current: AudioContext setup, event structure
// TODO: Implement Web Audio playback
// Components: AudioSource, AudioListener
```

### Input Integration
```typescript
// Current: Full keyboard and mouse tracking
// TODO: Add gamepad support, input mapping
```

### Asset Integration
```typescript
// Current: Basic loader structure
// TODO: Add loaders for models, textures, audio
```

## Extension Points

### Creating Custom Components
```typescript
class PlayerController extends Component {
  update(delta: UpdateDelta) {
    const input = this.entity.getTransform()
    // React to input, update position, etc
  }
}

player.addComponent(PlayerController)
```

### Creating Custom Systems
```typescript
class MyCustomSystem {
  update(delta: UpdateDelta) {
    // Custom logic
  }
}

// Add to engine lifecycle
engine.on('engine:update', (delta) => {
  mySystem.update(delta)
})
```

### Custom Loaders
```typescript
const assets = engine.getAssetManager()

// With custom loader
const customLoader = async (url: string) => {
  const response = await fetch(url)
  return response.json()
}

const data = await assets.loadAsset('mydata', 'path/to/data.json', customLoader)
```

## Performance Considerations

1. **Entity Update** — O(n) where n = number of active entities + components
2. **Physics** — Depends on integration (Cannon.js is ~O(n))
3. **Rendering** — Depends on geometry complexity, materials, lighting
4. **Memory** — Assets are cached; use `assetManager.unloadAsset()` to free memory

## Future Enhancements

- [ ] Object pooling for entities/components
- [ ] Spatial partitioning (octree/quadtree)
- [ ] Batch rendering optimization
- [ ] Web Workers for physics
- [ ] Resource lifecycle management
- [ ] Scene serialization (save/load)
- [ ] Networking support (multiplayer)
