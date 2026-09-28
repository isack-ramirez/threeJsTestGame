import { Engine } from '@darkfantasy/engine'
import * as THREE from 'three'
import { Player } from '../entities/Player'
import { LoadableScene } from './SceneLoader'
import { WorldManager } from '../world/WorldManager'
import type { CameraConfig } from '../types'

/**
 * Game scene - manages player and world
 */
export class GameScene {
  private engine: Engine
  private player: Player
  private scene: THREE.Scene
  private currentScene: LoadableScene | null = null
  private worldManager: WorldManager | null = null

  constructor(engine: Engine) {
    this.engine = engine
    this.scene = engine.getRenderer().getScene()
  }

  /**
   * Initialize with a single scene
   */
  async initializeWithScene(
    sceneFactory: () => Promise<LoadableScene>,
    cameraConfig?: CameraConfig
  ): Promise<void> {
    this.setupEnvironment()
    this.createPlayer(cameraConfig)

    // Load the scene
    this.currentScene = await sceneFactory()
    await this.currentScene.load()
    this.currentScene.onActivate(this.player)
  }

  /**
   * Initialize with tile-based world
   */
  async initializeWithTiles(cameraConfig?: CameraConfig): Promise<void> {
    this.setupEnvironment()
    this.createPlayer(cameraConfig)

    // Setup world manager
    this.worldManager = new WorldManager(this.scene, this.player)

    // Initial update to load starting tiles
    this.worldManager.update()
  }

  /**
   * Setup scene environment (lighting, background, etc)
   */
  private setupEnvironment(): void {
    // Background
    this.scene.background = new THREE.Color(0x1a1a2e)
    this.scene.fog = new THREE.Fog(0x1a1a2e, 300, 1000)

    // Ambient light - increased for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    this.scene.add(ambientLight)

    // Directional light (sun) - increased intensity
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
    directionalLight.position.set(150, 150, 150)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    directionalLight.shadow.camera.left = -300
    directionalLight.shadow.camera.right = 300
    directionalLight.shadow.camera.top = 300
    directionalLight.shadow.camera.bottom = -300
    directionalLight.shadow.camera.far = 2000
    this.scene.add(directionalLight)

    console.log('✅ Scene lighting initialized')
  }

  /**
   * Create and setup player
   */
  private createPlayer(cameraConfig?: CameraConfig): void {
    const camera = this.engine.getRenderer().getCamera() as THREE.PerspectiveCamera
    this.player = new Player(camera, cameraConfig ?? { mode: 'thirdperson', distance: 8, height: 1.6 })
    // Player is not added to scene - it's a logic entity, not a visual one
  }

  /**
   * Update (call every frame)
   */
  async update(): Promise<void> {
    if (this.worldManager) {
      this.worldManager.update()
    }
  }

  /**
   * Get the player entity
   */
  getPlayer(): Player {
    return this.player
  }

  /**
   * Get the scene
   */
  getScene(): THREE.Scene {
    return this.scene
  }

  /**
   * Get world manager
   */
  getWorldManager(): WorldManager | null {
    return this.worldManager
  }

  dispose(): void {
    this.player.dispose()
    this.currentScene?.dispose()
    this.worldManager?.dispose()
  }
}
