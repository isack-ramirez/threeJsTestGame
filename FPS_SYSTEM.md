# FPS System Guide

Complete first-person shooter (FPS) implementation with procedural dark fantasy chunks and full WASD + mouse controls.

## Overview

```
FPSPlayer (first-person entity)
├─ CameraComponent (first-person view)
└─ FPSControllerComponent (movement & looking)

FPSChunkScene (procedural dark fantasy chunks)
├─ Textured ground (stone, dirt, moss, rock)
├─ Random decorative rocks
└─ Dark pillars/columns

ChunkStreamer (coordinates rendering & loading)
├─ Frustum culling
├─ Chunk LOD management
└─ Player position tracking

GameManager.initializeFPS()
├─ Initializes FPS player
├─ Sets up chunk world
└─ Hooks streamer to engine loop
```

## Quick Start

```typescript
const game = new GameManager()
await game.initializeFPS({
  x: 0, z: 0    // Start chunk
}, 100, 2)       // Chunk size: 100x100, load radius: 2
game.start()
```

Or in `src/main.ts` (already set up):

```typescript
game.initializeFPS().then(() => game.start())
```

## Controls

| Key | Action |
|-----|--------|
| **W** | Move forward |
| **A** | Strafe left |
| **S** | Move backward |
| **D** | Strafe right |
| **Mouse** | Look around (pitch & yaw) |

## Components

### FPSPlayer (`src/entities/FPSPlayer.ts`)

First-person player entity with integrated camera and FPS controls.

```typescript
const camera = renderer.getCamera()
const input = engine.getInput()
const player = new FPSPlayer(camera, input)

// Player is at eye level (1.6 units high)
player.setPosition({ x: 0, y: 1.6, z: 0 })

// Get forward direction
const forward = player.getForwardDirection()

// Check if moving
if (player.isMoving()) { /* play footstep sound */ }

// Adjust speed/sensitivity
player.setMoveSpeed(40)
player.setLookSensitivity(0.003)
```

### FPSControllerComponent (`src/components/FPSControllerComponent.ts`)

Handles WASD movement and mouse look. Attached to FPSPlayer automatically.

**Features:**
- Frame-time independent movement
- Acceleration/deceleration (smooth stop)
- Speed clamping
- Pitch clamping (can't look up/down infinitely)
- Forward/right vector calculation from rotation

**Settings:**
```typescript
moveSpeed: 30          // Units per second
acceleration: 1        // How fast to reach max speed
deceleration: 0.2      // How fast to stop
lookSensitivity: 0.003 // Mouse sensitivity
maxPitch: π/2 - 0.1    // Prevent flipping camera
```

### CameraComponent (`src/components/CameraComponent.ts`)

First-person camera that follows player's eye height.

**First-person mode:**
- Camera at player position + eye height (1.6 units)
- Smooth interpolation (lerp)
- Looks where player faces

### TextureGenerator (`src/assets/TextureGenerator.ts`)

Procedurally generates dark fantasy textures.

```typescript
// Available textures:
TextureGenerator.generateStoneTexture()  // Gray with noise
TextureGenerator.generateDirtTexture()   // Brown earth
TextureGenerator.generateMossTexture()   // Dark green moss
TextureGenerator.generateRockTexture()   // Dark basalt
TextureGenerator.generateNormalMap()     // Normal map
```

Each is 512x512 canvas texture, automatically filtered and optimized.

### FPSChunkScene (`src/scenes/FPSChunkScene.ts`)

Procedurally generated chunks with dark fantasy aesthetic.

**Per-chunk content:**
- Textured ground plane (stone/dirt/moss - varies by chunk)
- 2-5 decorative rocks (random size/color)
- 0-2 cylindrical pillars (dark stone columns)

**Deterministic generation:**
- Same seed = same chunk layout (reproducible)
- Uses chunk coordinate for seeding
- Seamless chunk boundaries

```typescript
// Each chunk is independent
const chunk = new FPSChunkScene(scene, { x: 0, z: 0 }, 100)
await chunk.load()  // Generates ground + objects
```

### ChunkStreamer (`src/streamer/ChunkStreamer.ts`)

Coordinates chunk loading with player position and camera frustum.

```typescript
const streamer = new ChunkStreamer(
  chunkLoader,
  player,
  camera,
  100  // Chunk size
)

// Call every frame
await streamer.update()

// Get debug info
const info = streamer.getDebugInfo()
console.log(info.playerChunk)      // Current chunk
console.log(info.loadedChunks)     // Total loaded
console.log(info.visibleChunks)    // Frustum culled
```

**Features:**
- Frustum culling (only render visible chunks)
- Player chunk tracking
- LOD management
- Debug visualization

## Architecture

### Movement Flow

```
FPSControllerComponent.update()
  ├─ Read input (WASD keys)
  ├─ Calculate movement direction
  ├─ Apply acceleration/deceleration
  ├─ Clamp velocity
  └─ Update entity position

CameraComponent.update()
  ├─ Get entity position
  ├─ Add eye height offset
  ├─ Smooth interpolation (lerp)
  └─ Update Three.js camera
```

### Chunk Loading Flow

```
GameManager.update()
  └─ ChunkStreamer.update()
     ├─ Get player position
     ├─ Calculate player chunk
     ├─ ChunkLoader.update()
     │  ├─ Get chunks in radius
     │  ├─ Load missing chunks
     │  └─ Unload distant chunks
     └─ Frustum culling
        └─ Mark off-screen chunks
```

## Configuration

### Player Settings

```typescript
const player = game.getScene().getPlayer() // If stored
player.setMoveSpeed(50)         // Units/second
player.setLookSensitivity(0.002) // Mouse speed
```

### Chunk Settings

```typescript
game.initializeFPS(
  { x: 0, z: 0 },  // Start at chunk 0,0
  100,             // Chunk size: 100x100 units
  2                // Load radius: 2 = 5x5 grid = 25 chunks
)
```

### Load Radius

```
Radius 0: 1 chunk (current only)
Radius 1: 9 chunks (3x3 grid)
Radius 2: 25 chunks (5x5 grid)   ← Default
Radius 3: 49 chunks (7x7 grid)   ← High memory use
```

Adjust based on performance:
- Higher radius = more chunks in memory
- Lower radius = less draw calls but more loading

## Customization

### Create Custom FPS Chunks

```typescript
export class MyChunkScene extends FPSChunkScene {
  private setupDecorations() {
    // Override to add custom objects
    const worldX = this.chunkCoord.x * this.chunkSize
    const worldZ = this.chunkCoord.z * this.chunkSize

    // Add your objects here
    const mesh = new THREE.Mesh(...)
    mesh.position.set(worldX + x, y, worldZ + z)
    this.addObject(mesh)
  }
}
```

### Procedural Generation

```typescript
// In initializeFPS, provide custom chunk factory:
const chunkLoader = new ChunkLoader(
  scene,
  player,
  100,
  2,
  async (coord: ChunkCoord) => {
    // Generate based on coord
    return new ProceduralChunk(scene, coord)
  }
)
```

### Custom Textures

```typescript
// In FPSChunkScene:
const customTexture = generateNoiseTexture()
const material = new THREE.MeshStandardMaterial({
  map: customTexture,
  roughness: 0.8,
  metalness: 0.1
})
```

## Performance Tips

### Optimize Chunk Complexity

- Reduce geometry detail per chunk
- Use lower-poly models
- Combine geometries with threejs-instancing

### Optimize Rendering

- Enable frustum culling (already done)
- Use LOD (far chunks = lower detail)
- Batch draw calls (combine meshes)
- Limit shadow casting

### Memory Management

- Reduce load radius if needed
- Unload textures when chunk unloads
- Use object pooling for frequent spawn/despawn
- Monitor chunk memory usage

### Debug Performance

```typescript
// Log debug info
const streamer = game.getStreamer()
if (streamer) {
  const info = streamer.getDebugInfo()
  console.log(`Loaded: ${info.loadedChunks}, Visible: ${info.visibleChunks}`)
}
```

## Debugging

### Check Player Position

```typescript
const game = new GameManager()
// ... initialize ...
const scene = game.getScene()
const player = scene.getPlayer() as FPSPlayer
console.log(player.getTransform().position)
```

### Monitor Chunks

```typescript
const streamer = game.getStreamer()
console.log(streamer.getDebugInfo())
```

### Visualize Frustum

```typescript
// Add to update loop for visualization
const camera = engine.getRenderer().getCamera()
// Could add camera helper to show frustum
```

## Known Limitations

- ⚠️ Mouse look needs pointer lock for smooth FPS experience
- ⚠️ No collision detection yet (walk through walls)
- ⚠️ No jump mechanic
- ⚠️ Chunks aren't seamlessly stitched (small seams possible)

## Future Enhancements

- [ ] Pointer lock API for full mouse control
- [ ] Collision detection (raycasting)
- [ ] Jump/crouch mechanics
- [ ] Sprint/stamina system
- [ ] Footstep audio
- [ ] Weapon aiming reticle
- [ ] Procedural biomes
- [ ] Caves/underground generation
- [ ] Weather system
- [ ] Day/night cycle

## Troubleshooting

### Player can't move
- Check InputManager is properly initialized
- Verify WASD keys are being detected
- Check velocity isn't clamped to zero

### Camera doesn't follow player
- Verify CameraComponent is attached
- Check eye height (default 1.6)
- Ensure camera position updates each frame

### Chunks not loading
- Check ChunkLoader is initialized
- Verify player position is being tracked
- Check load radius setting

### Performance is poor
- Reduce load radius
- Reduce chunk geometry complexity
- Enable frustum culling (already done)
- Profile in browser DevTools
