# Project Structure

## Overview

```
testDarkFantasyGame/
├── packages/
│   └── engine/                    # 🎮 Portable Game Engine (@darkfantasy/engine)
│       ├── src/
│       │   ├── core/             # Types, EventEmitter, utilities
│       │   ├── renderer/         # Three.js wrapper
│       │   ├── input/            # Input management
│       │   ├── entity/           # Entity-Component system
│       │   ├── physics/          # Physics system (placeholder)
│       │   ├── audio/            # Audio management
│       │   ├── assetManager/     # Asset loading
│       │   ├── Engine.ts         # Main engine class
│       │   └── index.ts          # Exports
│       ├── dist/                 # Compiled JavaScript & types
│       ├── package.json
│       ├── tsconfig.json
│       ├── README.md
│       └── ARCHITECTURE.md
│
├── src/                           # 🎮 Game Code
│   ├── main.ts                   # Entry point
│   ├── game/
│   │   ├── GameManager.ts        # Main game orchestrator
│   │   └── index.ts
│   ├── scenes/
│   │   ├── GameScene.ts          # Level/scene setup
│   │   └── index.ts
│   ├── entities/
│   │   ├── Player.ts             # Player entity
│   │   └── index.ts
│   ├── components/
│   │   ├── CameraComponent.ts    # Camera control
│   │   └── index.ts
│   ├── systems/                  # Game systems (movement, combat, etc)
│   ├── managers/                 # Game state (UI, inventory, etc)
│   ├── utils/                    # Helper functions
│   ├── types/                    # Game-specific types
│   └── README.md
│
├── index.html                    # HTML template
├── vite.config.js                # Vite build config
├── tsconfig.json                 # Root TypeScript config
├── package.json                  # Root dependencies
├── README.md                     # Project overview
├── DEVELOPMENT.md                # Development guide
├── PROJECT_STRUCTURE.md          # This file
└── .gitignore
```

## Directory Purposes

### `packages/engine/` — Game Engine (NPM Package)
Reusable, portable game engine built on Three.js.

**Features:**
- Entity-Component system
- Input management
- Physics integration ready
- Audio system
- Asset management
- Event-driven architecture

**Status:** Scaffolded ✅, Ready for implementation

### `src/` — Game Code
Game-specific code using the engine.

#### `src/game/`
Game initialization and lifecycle management.
- **GameManager** — Main entry point, orchestrates all systems

#### `src/scenes/`
Scene definitions and level setup.
- **GameScene** — Main game level with player and environment

#### `src/entities/`
Game entities extending the base Entity class.
- **Player** — Player character with camera control

#### `src/components/`
Game-specific components.
- **CameraComponent** — First/third person camera follow

#### `src/systems/`
(To be created) Game systems like movement, combat, AI, etc.

#### `src/managers/`
(To be created) Game managers like UI, inventory, dialogue, etc.

#### `src/utils/`
(To be created) Helper utilities and common functions.

#### `src/types/`
Game-specific type definitions.
- **CameraConfig** — Camera configuration types

## Data Flow

```
user input
  ↓
Engine.InputManager
  ↓
GameManager.handleInput()
  ↓
Player.setCameraMode() / Movement logic
  ↓
Component.update()
  ↓
Engine.render()
  ↓
Three.js renderer
  ↓
Display
```

## Build System

```
src/main.ts (TypeScript)
  ↓
Vite + TypeScript compilation
  ↓
dist/index.js (JavaScript)
  ↓
Browser
```

Engine builds separately:
```
packages/engine/src/ (TypeScript)
  ↓
tsc compilation
  ↓
packages/engine/dist/ (JavaScript + .d.ts)
  ↓
imported in src/
```

## Adding New Features

### Add a New Entity
1. Create `src/entities/MyEntity.ts`
2. Export from `src/entities/index.ts`
3. Add to GameScene in `src/scenes/GameScene.ts`

### Add a New Component
1. Create `src/components/MyComponent.ts` extending `Component`
2. Export from `src/components/index.ts`
3. Attach to entity: `entity.addComponent(MyComponent)`

### Add a New System
1. Create `src/systems/MySystem.ts`
2. Create folder: `src/systems/` if needed
3. Hook into GameManager lifecycle
4. Export from `src/systems/index.ts`

### Add a New Manager
1. Create `src/managers/MyManager.ts`
2. Instantiate in GameManager
3. Export from `src/managers/index.ts`

## Important Notes

⚠️ **Engine vs Game Separation**
- Engine (`packages/engine/`) should be generic and reusable
- Game (`src/`) is specific to Dark Fantasy Game
- Don't add game logic to the engine
- Don't import game code in the engine

✅ **TypeScript Everywhere**
- All code uses TypeScript
- Strict mode enabled
- Full type safety

🔄 **Component-Based**
- Prefer composition over inheritance
- Keep components single-responsibility
- Reuse components across entities

📦 **Modular Structure**
- Each folder is independently testable
- Easy to find code by feature/system
- Scales well as game grows

## Future Organization

As the project grows, consider:

```
src/
├── assets/
│   ├── models/
│   ├── textures/
│   ├── audio/
│   └── animations/
├── config/
│   ├── settings.ts
│   ├── constants.ts
│   └── defaults.ts
├── game/
├── scenes/
├── entities/
├── components/
├── systems/
├── managers/
├── ui/
│   ├── panels/
│   ├── hud/
│   └── menus/
├── audio/
├── particles/
├── shaders/
├── physics/
├── utils/
├── types/
└── tests/
```
