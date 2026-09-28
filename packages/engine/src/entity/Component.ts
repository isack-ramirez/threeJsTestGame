import { Entity } from './Entity'
import { UpdateDelta } from '../core/types'

/**
 * Base class for all components
 */
export abstract class Component {
  protected entity: Entity

  constructor(entity: Entity) {
    this.entity = entity
  }

  getEntity(): Entity {
    return this.entity
  }

  onEnable(): void {}
  onDisable(): void {}

  abstract update(delta: UpdateDelta): void

  dispose(): void {}
}
