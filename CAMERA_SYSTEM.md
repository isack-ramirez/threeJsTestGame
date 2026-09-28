# Camera System Architecture

## Overview

The camera system provides flexible first/third-person camera control following a player entity.

## Class Hierarchy

```
Entity (engine base)
  └─ Player (game entity)
     └─ CameraComponent (attached)
        └─ Controls camera movement
```

## Player Entity

**File:** `src/entities/Player.ts`

```typescript
class Player extends Entity {
  constructor(camera: THREE.Camera, config: CameraConfig)
  getCameraComponent(): CameraComponent
  getCamera(): THREE.Camera
  setCameraMode(mode: 'firstperson' | 'thirdperson'): void
  getCameraMode(): 'firstperson' | 'thirdperson'
  setCameraDistance(distance: number): void
  setCameraHeight(height: number): void
}
```

**Usage:**
```typescript
const player = new Player(camera, { mode: 'thirdperson', distance: 8 })
player.setCameraMode('firstperson')  // Switch to first person
player.setCameraDistance(12)          // Increase third-person distance
```

## CameraComponent

**File:** `src/components/CameraComponent.ts`

Implements `Component` interface. Attached to Player as a behavior.

### First Person Mode

```
Camera Position = Entity Position + Height + Offset
                = (0, 0, 0) + 1.6 + (0, 0, 0)
                = (0, 1.6, 0)

Look Target = Entity Position + Height
            = (0, 0, 0) + 1.6
            = (0, 1.6, 0)
```

**Result:** Camera at player's eye level, looking ahead

### Third Person Mode

```
Forward Vector = Entity's facing direction
Distance = Camera distance (default: 8 units)

Camera Position = Entity Position 
                + Forward Vector * Distance
                + Height offset
                = (0, 0, 0) + (0, 0, 1) * 8 + (0, 1.6, 0)
                = (0, 1.6, 8)

Look Target = Entity Position + Height
            = (0, 0, 0) + 1.6
            = (0, 1.6, 0)
```

**Result:** Camera orbits behind player, looking at them

## Configuration

**File:** `src/types/index.ts`

```typescript
interface CameraConfig {
  mode: 'firstperson' | 'thirdperson'
  distance?: number        // Third person distance (default: 8)
  height?: number         // Eye height (default: 1.6)
  offset?: {              // Additional offset
    x: number
    y: number
    z: number
  }
}
```

## Camera Movement

### Smooth Transitions

The camera smoothly interpolates to target position using `lerp`:

```typescript
currentPos.lerp(targetPos, deltaTime * smoothSpeed)
```

- `smoothSpeed` = 5 (adjustable)
- Faster movement = higher speed
- Frame-time independent (uses deltaTime)

### Update Flow

Each frame:

1. **Calculate Target Position**
   - First Person: Entity position + height
   - Third Person: Entity position - forward vector * distance + height

2. **Interpolate Camera**
   - `currentPos.lerp(targetPos, deltaTime * smoothSpeed)`

3. **Update Three.js Camera**
   - `camera.position.copy(currentPos)`
   - `camera.lookAt(entity.position + height)`

## Integration Points

### Engine Loop

Camera updates automatically in `Component.update()`:

```
Engine.update()
  ↓
Entity.update(delta)
  ↓
CameraComponent.update(delta)  ← Camera moves here
  ↓
Renderer.render()              ← Camera renders scene
```

### Input Integration

Switch modes with input event:

```typescript
input.on('keydown', (event) => {
  if (event.key === 'c') {
    player.setCameraMode('firstperson')
  }
})
```

## Example: Custom Camera Offset

```typescript
// Create player with offset camera
const player = new Player(camera, {
  mode: 'thirdperson',
  distance: 10,
  height: 2.0,
  offset: { x: 2, y: 0, z: 0 }  // Offset to the side
})
```

Result: Third-person camera positioned to the side of player.

## Example: Attach to Different Entity

```typescript
import { CameraComponent } from './components/CameraComponent'
import { Entity } from '@darkfantasy/engine'

// Create a drone entity
const drone = new Entity('Drone')

// Attach camera to drone
drone.addComponent(class extends CameraComponent {
  constructor(entity: Entity) {
    super(entity, camera, { mode: 'thirdperson', distance: 5 })
  }
})
```

## Next Enhancements

- [ ] Head bob animation in first person
- [ ] Collision detection (camera doesn't go through walls)
- [ ] Zoom in/out (adjust distance)
- [ ] Camera shake on impact
- [ ] Over-the-shoulder third person variant
- [ ] Cinematic camera paths (cutscenes)
- [ ] First/third person blending transition

## Performance Considerations

- ✅ Single camera update per frame
- ✅ No allocation in update loop (reuses vectors)
- ✅ Efficient lerp calculation
- ✅ Minimal overhead for additional entities

## Debugging

Enable camera info in console:

```typescript
const player = game.getScene().getPlayer()
console.log(player.getCameraMode())           // Current mode
console.log(player.getCameraComponent())      // Component reference
console.log(player.getCamera().position)      // Camera world position
```
