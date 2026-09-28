import { Renderer } from './renderer/Renderer'
import { PhysicsSystem } from './physics/PhysicsSystem'
import { AudioManager } from './audio/AudioManager'
import { InputManager } from './input/InputManager'
import { AssetManager } from './assetManager/AssetManager'
import { Entity } from './entity/Entity'
import { EngineConfig, UpdateDelta } from './core/types'
import { EventEmitter } from './core/EventEmitter'

/**
 * Main engine class - orchestrates all subsystems
 */
export class Engine extends EventEmitter {
  private renderer: Renderer
  private physics: PhysicsSystem
  private audio: AudioManager
  private input: InputManager
  private assetManager: AssetManager
  private rootEntity: Entity
  private isRunning: boolean = false
  private animationFrameId: number | null = null
  private lastTime: number = 0
  private deltaTime: number = 0
  private elapsedTime: number = 0

  constructor(config: EngineConfig = {}) {
    super()

    this.renderer = new Renderer(config)
    this.physics = new PhysicsSystem()
    this.audio = new AudioManager()
    this.input = new InputManager()
    this.assetManager = new AssetManager()
    this.rootEntity = new Entity('Root')

    this.setupInputListeners()
  }

  private setupInputListeners(): void {
    // Input events can be hooked into here
    this.input.on('keydown', (event) => {
      this.emit('input:keydown', event)
    })
  }

  /**
   * Get access to subsystems
   */
  getRenderer(): Renderer {
    return this.renderer
  }

  getPhysics(): PhysicsSystem {
    return this.physics
  }

  getAudio(): AudioManager {
    return this.audio
  }

  getInput(): InputManager {
    return this.input
  }

  getAssetManager(): AssetManager {
    return this.assetManager
  }

  getRootEntity(): Entity {
    return this.rootEntity
  }

  /**
   * Create and register a new entity
   */
  createEntity(name: string = 'Entity'): Entity {
    const entity = new Entity(name)
    this.rootEntity.addChild(entity)
    this.physics.addEntity(entity)
    return entity
  }

  /**
   * Start the engine update loop
   */
  start(): void {
    if (this.isRunning) return
    this.isRunning = true
    this.lastTime = performance.now()
    this.emit('engine:start')
    this.update()
  }

  /**
   * Stop the engine update loop
   */
  stop(): void {
    if (!this.isRunning) return
    this.isRunning = false
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    this.emit('engine:stop')
  }

  /**
   * Main update loop
   */
  private update = (): void => {
    if (!this.isRunning) return

    const now = performance.now()
    this.deltaTime = (now - this.lastTime) / 1000 // Convert to seconds
    this.lastTime = now
    this.elapsedTime += this.deltaTime

    const delta: UpdateDelta = {
      deltaTime: this.deltaTime,
      elapsedTime: this.elapsedTime
    }

    // Update all systems
    this.physics.update(delta)
    this.rootEntity.update(delta)
    this.renderer.render(delta)

    this.emit('engine:update', delta)

    this.animationFrameId = requestAnimationFrame(this.update)
  }

  /**
   * Get current frame time info
   */
  getDelta(): UpdateDelta {
    return {
      deltaTime: this.deltaTime,
      elapsedTime: this.elapsedTime
    }
  }

  /**
   * Clean up engine resources
   */
  dispose(): void {
    this.stop()
    this.rootEntity.dispose()
    this.renderer.dispose()
    this.physics.dispose()
    this.audio.dispose()
    this.input.dispose()
    this.assetManager.dispose()
    this.clear()
  }
}
