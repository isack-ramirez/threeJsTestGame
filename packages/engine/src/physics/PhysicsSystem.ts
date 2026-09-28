import { UpdateDelta } from '../core/types'
import { Entity } from '../entity/Entity'

/**
 * Physics system - handles physics simulation
 *
 * TODO: Integrate with physics library (e.g., Cannon.js, Oimo.js)
 */
export class PhysicsSystem {
  private entities: Set<Entity> = new Set()
  private enabled: boolean = true

  constructor() {
    // Initialize physics world
  }

  addEntity(entity: Entity): void {
    this.entities.add(entity)
  }

  removeEntity(entity: Entity): void {
    this.entities.delete(entity)
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  isEnabled(): boolean {
    return this.enabled
  }

  update(_delta: UpdateDelta): void {
    if (!this.enabled) return

    // TODO: Physics simulation step
    // - Apply forces
    // - Resolve collisions
    // - Update entity transforms
  }

  raycast(_origin: any, _direction: any, _maxDistance: number): any {
    // TODO: Implement raycasting
    return null
  }

  dispose(): void {
    this.entities.clear()
  }
}
