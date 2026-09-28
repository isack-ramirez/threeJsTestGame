# Scene & Chunk Loading System

A flexible system for loading content - use single scenes or infinite chunk-based worlds interchangeably.

## Overview

```
GameManager
├─ Traditional Mode: Single Scene
│  └─ GameScene → LoadableScene (DemoScene)
│
└─ Streaming Mode: Chunk-Based World
   └─ GameScene → ChunkLoader → ChunkScene instances
```

## Two Loading Modes

### Mode 1: Single Scene (Traditional Levels)

Load a discrete level:

```typescript
const game = new GameManager()
await game.initializeScene('thirdperson')
game.start()
```

**Use Cases:**
- Dungeons
- Boss arenas
- Instanced content
- Small levels

**Features:**
- Simple to implement
- Entire level in memory
- Good for bounded spaces

### Mode 2: Chunk-Based World (Streaming)

Load/unload chunks dynamically around player:

```typescript
const game = new GameManager()
await game.initializeChunks(
  { x: 0, z: 0 },  // Start at chunk 0,0
  100,              // Chunk size (100x100 units)
  2,                // Load radius (5x5 grid = 25 chunks)
  'thirdperson'
)
game.start()
```

**Use Cases:**
- Open worlds
- MMO-style maps
- Procedural generation
- Infinite terrain

**Features:**
- Dynamic loading/unloading
- Memory efficient
- Supports procedural generation
- Seamless world traversal

## Architecture

### LoadableScene (Base Class)

All scenes/chunks extend `LoadableScene`:

```typescript
abstract class LoadableScene {
  abstract load(): Promise<void>    // Load content
  abstract unload(): void           // Unload content
  abstract onActivate(player): void // Called when active
  abstract onDeactivate(): void     // Called when inactive
  abstract dispose(): void          // Cleanup resources
}
```

### DemoScene (Single Scene Implementation)

```typescript
class DemoScene extends LoadableScene {
  // Traditional level with lighting, ground, decorations
  async load() { /* setup */ }
  onActivate(player) { console.log('Level started') }
  // ...
}
```

### ChunkScene (Chunk Implementation)

```typescript
class ChunkScene extends LoadableScene {
  constructor(scene, chunkCoord, chunkSize)
  
  // Each chunk has its own ground and decorations
  async load() { /* setup */ }
  getChunkCoord() { /* return chunk position */ }
  // ...
}
```

### ChunkLoader (Chunk Manager)

Manages chunk lifecycle:

```typescript
class ChunkLoader {
  // Monitor player position, load/unload chunks
  async update() { /* check nearby chunks */ }
  setLoadRadius(radius) { /* adjust LOD */ }
  getActiveChunks() { /* list of loaded chunk keys */ }
}
```

## Chunk System Details

### Coordinate System

Chunks use integer grid coordinates:

```
Chunk (0, 0)  Chunk (1, 0)  Chunk (2, 0)
Chunk (0, 1)  Chunk (1, 1)  Chunk (2, 1)
Chunk (0, 2)  Chunk (1, 2)  Chunk (2, 2)
```

### Chunk Size

Default: 100 units × 100 units

World position ↔ Chunk coordinate:

```typescript
chunkX = Math.floor(worldX / chunkSize)
chunkZ = Math.floor(worldZ / chunkSize)

// For chunk (0, 0) with size 100:
// World: (0-99.99, 0-99.99)
// For chunk (1, 1):
// World: (100-199.99, 100-199.99)
```

### Load Radius

How many chunks away to keep loaded:

```
Radius 0: 1 chunk (current)
          ░
          
Radius 1: 9 chunks
          ░ ░ ░
          ░ X ░
          ░ ░ ░
          
Radius 2: 25 chunks
          ░ ░ ░ ░ ░
          ░ ░ ░ ░ ░
          ░ ░ X ░ ░
          ░ ░ ░ ░ ░
          ░ ░ ░ ░ ░
```

### Update Loop

```
Every frame:
1. Get player world position
2. Calculate player's chunk coordinate
3. Get all chunks within load radius
4. Unload chunks outside radius
5. Load chunks inside radius
6. Report active chunks
```

## Creating Custom Scenes

### Extend LoadableScene

```typescript
import { LoadableScene } from './scenes/SceneLoader'
import { Player } from './entities/Player'
import * as THREE from 'three'

export class MyScene extends LoadableScene {
  private scene: THREE.Scene
  private objects: THREE.Object3D[] = []

  constructor(scene: THREE.Scene) {
    super('MyScene')
    this.scene = scene
  }

  async load(): Promise<void> {
    // Create your content
    const mesh = new THREE.Mesh(...)
    this.scene.add(mesh)
    this.objects.push(mesh)
  }

  unload(): void {
    // Cleanup content
    this.objects.forEach(obj => obj.removeFromParent())
  }

  onActivate(player: Player): void {
    // Called when scene becomes active
    console.log('Scene activated!')
  }

  onDeactivate(): void {
    // Called when scene becomes inactive
  }

  dispose(): void {
    this.unload()
    // Dispose Three.js resources
    this.objects.forEach(obj => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry?.dispose()
        obj.material?.dispose()
      }
    })
    this.objects = []
  }
}
```

### Use Custom Scene

```typescript
await gameScene.initializeWithScene(
  async () => new MyScene(gameScene.getScene())
)
```

## Creating Custom Chunks

```typescript
import { ChunkScene } from './scenes/ChunkScene'
import type { ChunkCoord } from './systems/ChunkLoader'

export class MyChunkScene extends ChunkScene {
  // Override setupDecorations() to customize chunk content
  protected setupDecorations() {
    // Generate chunk-specific content
    // e.g., procedural terrain, randomized objects, etc.
  }
}
```

### Use Custom Chunks

```typescript
await gameScene.initializeWithChunks(
  { x: 0, z: 0 },
  100,
  2,
  {
    mode: 'thirdperson',
    async chunkFactory(coord: ChunkCoord) {
      return new MyChunkScene(gameScene.getScene(), coord)
    }
  }
)
```

## Debugging

### Single Scene

```typescript
const game = new GameManager()
await game.initializeScene()
const scene = game.getScene()
console.log(scene.isUsingChunks())  // false
```

### Chunks

```typescript
const game = new GameManager()
await game.initializeChunks()
const loader = game.getScene().getChunkLoader()
console.log(loader.getActiveChunks())  // ['0,0', '1,0', etc.]

// Adjust load radius at runtime
loader.setLoadRadius(3)  // Load more chunks
```

## Performance Tips

### Single Scene
- ✅ Good for small/medium levels
- ⚠️ Keep object count reasonable (<10k)
- ⚠️ Be mindful of draw calls

### Chunks
- ✅ Reduces memory per-chunk
- ✅ Enables larger worlds
- ⚠️ Chunk boundaries should be seamless
- ⚠️ Load radius affects memory usage
- 📊 Typical: ~1-10k objects per chunk

### Memory Optimization
- Use LOD (level-of-detail) for distant chunks
- Unload textures/geometries when chunk unloads
- Use object pooling for frequent spawn/despawn
- Profile chunk loading times

## Switching Between Modes

Can't directly switch, but can reload:

```typescript
// Switch from single scene to chunks
game.dispose()
const game2 = new GameManager()
await game2.initializeChunks()
game2.start()
```

## Future Enhancements

- [ ] Procedural chunk generation
- [ ] Chunk persistence (save/load)
- [ ] Seamless boundaries
- [ ] LOD system for chunks
- [ ] Chunk transitions/fading
- [ ] Pre-loading priority queue
- [ ] Background chunk generation
- [ ] Streaming from disk/network
