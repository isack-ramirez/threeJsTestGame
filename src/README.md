# Game Code Structure

```
src/
├── main.ts                   # Entry point
├── game/
│   ├── GameManager.ts        # Main game orchestrator
│   └── index.ts
├── scenes/
│   ├── GameScene.ts          # Scene setup and initialization
│   └── index.ts
├── entities/
│   ├── Player.ts             # Player entity with camera
│   └── index.ts
├── components/
│   ├── CameraComponent.ts    # First/third person camera
│   └── index.ts
├── systems/                  # Game-specific systems
│   ├── (movement, combat, etc)
│   └── index.ts
├── managers/                 # Game state managers
│   ├── (ui, inventory, etc)
│   └── index.ts
├── utils/                    # Helper functions
│   └── index.ts
├── types/                    # Game-specific types
│   └── index.ts
└── README.md                 # This file
```

## Architecture Flow

```
main.ts
  └─ GameManager
     ├─ Engine (from @darkfantasy/engine)
     └─ GameScene
        ├─ Player (extends Entity)
        │  └─ CameraComponent
        └─ Environment (lights, ground, etc)
```

## Key Classes

### GameManager
Main entry point for the game. Handles:
- Engine initialization
- Scene setup
- Game lifecycle
- Input handling

### GameScene
Scene setup and entity creation. Handles:
- Environment (lighting, ground, fog)
- Player initialization
- Scene management

### Player
Game entity representing the player. Features:
- Extends Engine's Entity class
- Camera component attachment
- First/third person support
- Camera control methods

### CameraComponent
Follows the player and implements:
- First person view (head height)
- Third person view (behind player)
- Smooth camera transitions
- Customizable distance and height

## Adding New Entities

```typescript
// src/entities/Enemy.ts
import { Entity } from '@darkfantasy/engine'

export class Enemy extends Entity {
  constructor() {
    super('Enemy')
    // Setup enemy
  }
}

// In GameScene.ts
const enemy = new Enemy()
this.scene.add(enemy as any)
```

## Adding New Components

```typescript
// src/components/MovementComponent.ts
import { Component, UpdateDelta } from '@darkfantasy/engine'

export class MovementComponent extends Component {
  update(delta: UpdateDelta) {
    // Movement logic
  }
}

// Attach to entity
player.addComponent(class extends MovementComponent {
  constructor(entity) { super(entity) }
})
```

## Adding New Systems

Create game-specific systems in `src/systems/`:

```typescript
// src/systems/CombatSystem.ts
export class CombatSystem {
  update(delta) {
    // Combat logic
  }
}

// In GameManager
const combatSystem = new CombatSystem()
this.engine.on('engine:update', () => combatSystem.update(delta))
```

## Quick Commands

```bash
npm run dev          # Hot reload dev server
npm run build        # Build for production
```

## Next Steps

1. **Movement System** — Handle WASD movement
2. **Animation System** — Play animations on player
3. **Mesh Rendering** — Display 3D models
4. **Collision Detection** — Physics integration
5. **UI System** — HUD and menus
