import { Player } from '../entities/Player'

/**
 * Base class for loadable scenes/chunks
 * Can be extended for different level types
 */
export abstract class LoadableScene {
  protected name: string

  constructor(name: string) {
    this.name = name
  }

  /**
   * Initialize and load the scene content
   */
  abstract load(): Promise<void>

  /**
   * Unload scene content
   */
  abstract unload(): void

  /**
   * Called when scene becomes active
   */
  abstract onActivate(player: Player): void

  /**
   * Called when scene becomes inactive
   */
  abstract onDeactivate(): void

  /**
   * Get scene name
   */
  getName(): string {
    return this.name
  }

  /**
   * Dispose of all resources
   */
  abstract dispose(): void
}
