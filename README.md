# Dark Fantasy Game

A 3D game built with a custom TypeScript game engine (@darkfantasy/engine) on top of Three.js.

## Project Structure

```
├── packages/
│   └── engine/                  # Game engine (separate npm package)
│       ├── src/
│       │   ├── core/           # Core types and utilities
│       │   ├── renderer/       # Three.js renderer wrapper
│       │   ├── physics/        # Physics system
│       │   ├── audio/          # Audio system
│       │   ├── input/          # Input handling
│       │   ├── entity/         # Entity/Component system
│       │   ├── assetManager/   # Asset loading
│       │   ├── Engine.ts       # Main orchestrator
│       │   └── index.ts        # Package exports
│       ├── package.json        # Engine package config
│       ├── tsconfig.json       # TypeScript config
│       └── README.md           # Engine documentation
├── src/
│   └── main.ts                 # Game entry point
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── tsconfig.json               # Root TypeScript config
├── package.json                # Project dependencies
└── README.md                   # This file
```

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development Server
Run the development server with hot module reloading:
```bash
npm run dev
```

The app will open automatically at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## Features

### Game Engine (@darkfantasy/engine)
- **Modular Architecture**: Separate systems for rendering, physics, audio, input, and assets
- **Entity-Component System**: Build game objects with reusable components
- **Event-Driven**: Loose coupling between systems using events
- **TypeScript**: Full type safety and IDE support
- **Portable**: Designed to be extracted as a separate npm package

### Development
- **Vite**: Fast build tool with hot module replacement
- **TypeScript**: Modern type-safe development
- **Three.js**: Industry-standard 3D graphics library

## Development

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```

Opens at `http://localhost:3000` with hot reload.

### Build Engine
```bash
npm run build:engine
```

Compiles TypeScript engine to `packages/engine/dist/`.

### Build Project
```bash
npm run build
```

Builds both engine and game for production.

## Game Development

See [`packages/engine/README.md`](packages/engine/README.md) for engine API documentation.

Example: Create a game entity with a component
```typescript
const player = engine.createEntity('Player')

class PlayerController extends Component {
  update(delta: UpdateDelta) {
    const input = this.entity.getTransform()
    // Update player based on input
  }
}

player.addComponent(PlayerController)
```

## Publishing the Engine

When ready, the engine can be published to npm:

```bash
cd packages/engine
npm publish
```

Then consumed as a standard package:
```bash
npm install @darkfantasy/engine
```
