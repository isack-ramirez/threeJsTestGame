# Getting Started - Dark Fantasy Game

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Navigate to `http://localhost:3000`

4. **Play:**
   - **W/A/S/D** - Move around
   - **Mouse** - Look around
   - Explore the procedurally generated dark fantasy world!

## What You'll See

- A first-person view in a dark fantasy world
- Procedurally generated chunks (100x100 units each)
- Textured ground (stone, dirt, moss, rock)
- Decorative rocks and dark pillars
- Chunks load/unload as you move (shows in top-left corner)
- Smooth FPS movement with acceleration/deceleration

## Project Structure

```
testDarkFantasyGame/
├── packages/engine/          # Portable game engine (reusable NPM package)
│   ├── src/
│   │   ├── core/            # EventEmitter, types
│   │   ├── renderer/        # Three.js wrapper
│   │   ├── input/           # Input manager
│   │   ├── entity/          # Entity-component system
│   │   ├── physics/         # Physics placeholder
│   │   ├── audio/           # Audio system
│   │   ├── assetManager/    # Asset loading
│   │   └── Engine.ts        # Main orchestrator
│   └── dist/                # Compiled engine
│
├── src/                      # Game-specific code
│   ├── main.ts              # Entry point (calls GameManager.initializeFPS)
│   ├── game/
│   │   └── GameManager.ts   # Game lifecycle & initialization
│   ├── scenes/
│   │   ├── GameScene.ts     # Scene manager
│   │   ├── FPSChunkScene.ts # Procedurally generated chunks
│   │   └── ...other scenes
│   ├── entities/
│   │   ├── FPSPlayer.ts     # First-person player with controls
│   │   └── Player.ts        # Third-person player (template)
│   ├── components/
│   │   ├── FPSControllerComponent.ts  # WASD + mouse look
│   │   ├── CameraComponent.ts         # Camera follow
│   │   └── ...
│   ├── systems/
│   │   └── ChunkLoader.ts   # Chunk streaming system
│   ├── streamer/
│   │   └── ChunkStreamer.ts # Coordinates rendering & loading
│   ├── assets/
│   │   └── TextureGenerator.ts  # Procedural textures
│   ├── types/
│   │   └── index.ts         # Game types
│   └── utils/
│
├── index.html               # Main HTML page (renders canvas here)
├── vite.config.js           # Vite build config
├── tsconfig.json            # TypeScript config
├── package.json             # Dependencies
└── README.md                # Project readme
```

## Architecture

### Engine (packages/engine/)

Reusable game engine with core systems:
- **Renderer** — Three.js wrapper
- **Input** — Keyboard & mouse
- **Entity-Component** — Hierarchical game objects
- **Physics** — Placeholder for Cannon.js
- **Audio** — Web Audio API wrapper
- **Assets** — Resource loading & caching

### Game (src/)

Uses the engine to build the Dark Fantasy Game:

1. **GameManager** initializes everything
   - Creates Engine instance
   - Calls `initializeFPS()`
   - Hooks update loop
   - Manages lifecycle

2. **FPSChunkScene** generates chunks
   - Procedural terrain (stone/dirt/moss)
   - Random rocks and pillars
   - Deterministic (same seed = same chunk)
   - Textured with canvas-generated textures

3. **FPSPlayer** is the player entity
   - First-person camera (eye height 1.6)
   - FPSControllerComponent for movement
   - WASD movement + mouse look

4. **ChunkStreamer** manages rendering
   - Tracks player position
   - Updates chunk loading
   - Frustum culls (only visible chunks render)

## What's Implemented

✅ **Working:**
- First-person player movement (WASD)
- Mouse look (pitch & yaw)
- Procedurally generated chunks
- Dark fantasy textures (stone, dirt, moss, rock)
- Chunk loading/unloading as you move
- Smooth camera following
- Frustum culling (performance optimization)
- Entity-component system
- Event-driven architecture

⚠️ **TODO:**
- Collision detection (can walk through terrain)
- Jump/gravity
- Weapons/combat
- NPC/AI
- Audio/music
- Animations
- Better terrain generation
- Sky/weather

## Configuration

### Change Movement Speed
```typescript
// In src/main.ts, after game initializes:
const player = game.getScene().getPlayer() as FPSPlayer
player.setMoveSpeed(50)  // Default: 30
```

### Change Chunk Load Radius
```typescript
game.initializeFPS(
  { x: 0, z: 0 },
  100,  // Chunk size
  3     // Load radius (3 = 7x7 grid = 49 chunks, slower)
)
```

### Change Camera Sensitivity
```typescript
const player = game.getScene().getPlayer() as FPSPlayer
player.setLookSensitivity(0.005)  // Default: 0.003
```

### Start at Different Chunk
```typescript
game.initializeFPS(
  { x: 5, z: 10 },  // Start at chunk (5, 10)
  100,
  2
)
```

## Building for Production

```bash
npm run build:engine  # Compile engine TypeScript
npm run build         # Build everything for production
```

Output goes to `dist/` directory.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build:engine` | Compile engine TypeScript |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

## Debugging

### Check Console
- Browser DevTools > Console tab
- Shows chunk loading, initialization logs

### View Debug Info
```javascript
// In browser console:
game.getStreamer().getDebugInfo()
// Shows: playerChunk, loadedChunks, visibleChunks, playerPosition
```

### Monitor Performance
- Chrome DevTools > Performance tab
- Record, move around, check FPS
- Aim for 60 FPS

## Next Steps

1. **Add collision detection** (raycasting)
   - Prevent walking through walls
   - Platform-based movement

2. **Add jump** (gravity & velocity)
   - Space key to jump
   - Gravity pulls down

3. **Add weapons** (raycast attacks)
   - Crosshair reticle
   - Melee/ranged weapons

4. **Add NPCs** (enemy spawning)
   - Pathfinding AI
   - Combat system

5. **Add audio** (sound effects & music)
   - Footstep sounds
   - Ambient music
   - Effect sounds

6. **Improve terrain** (better generation)
   - Biome system
   - Caves/dungeons
   - Procedural trees/plants

## Troubleshooting

### Game doesn't load
- Check browser console for errors
- Make sure Three.js WebGL is supported
- Try a different browser (Chrome recommended)

### Can't move
- Check WASD keys are working (use browser console)
- Verify InputManager in engine is initialized

### Performance is poor
- Reduce load radius (fewer chunks)
- Check DevTools Performance tab
- Disable shadows (temporary)

### Chunks aren't loading
- Check ChunkLoader console logs
- Verify player position updates
- Try moving around more

## Resources

- **Three.js docs:** https://threejs.org/docs/
- **Game engine architecture:** See `DEVELOPMENT.md`
- **FPS system details:** See `FPS_SYSTEM.md`
- **Scene/chunk loading:** See `SCENE_LOADING.md`
- **Camera system:** See `CAMERA_SYSTEM.md`

## Contact & Support

This is a personal project. For questions, check the code comments and documentation files.

Happy coding! 🎮
