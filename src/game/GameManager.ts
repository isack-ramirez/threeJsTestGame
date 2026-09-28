import { Engine, UpdateDelta, InputManager } from '@darkfantasy/engine'
import { GameScene } from '../scenes/GameScene'
import { DemoScene } from '../scenes/DemoScene'
import { FPSChunkScene } from '../scenes/FPSChunkScene'
import { FPSPlayer } from '../entities/FPSPlayer'
import { ChunkStreamer } from '../streamer/ChunkStreamer'
import type { CameraConfig } from '../types'
import type { ChunkCoord } from '../systems/ChunkLoader'

/**
 * Main game manager - orchestrates game lifecycle
 */
export class GameManager {
  private engine: Engine
  private gameScene: GameScene
  private fpsPlayer: FPSPlayer | null = null
  private chunkStreamer: ChunkStreamer | null = null

  constructor() {
    this.engine = new Engine({
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
      enablePhysics: true,
      enableAudio: true
    })
  }

  /**
   * Initialize with single scene
   */
  async initializeScene(cameraMode: CameraConfig['mode'] = 'thirdperson'): Promise<void> {
    this.gameScene = new GameScene(this.engine)
    await this.gameScene.initializeWithScene(
      async () => new DemoScene(this.gameScene.getScene()),
      {
        mode: cameraMode,
        distance: 8,
        height: 1.6
      }
    )

    this.setupEngineListeners()

    console.log('✅ Game initialized (single scene)')
    console.log(`📷 Camera mode: ${cameraMode}`)
    console.log('Player controls:')
    console.log('  - WASD: Move')
    console.log('  - C: Toggle camera mode (1st/3rd person)')
  }

  /**
   * Initialize with chunk-based loading
   */
  async initializeChunks(
    startChunk?: ChunkCoord,
    chunkSize: number = 100,
    loadRadius: number = 1,
    cameraMode: CameraConfig['mode'] = 'thirdperson'
  ): Promise<void> {
    this.gameScene = new GameScene(this.engine)
    await this.gameScene.initializeWithChunks(
      startChunk ?? { x: 0, z: 0 },
      chunkSize,
      loadRadius,
      {
        mode: cameraMode,
        distance: 8,
        height: 1.6
      }
    )

    this.setupEngineListeners()

    console.log('✅ Game initialized (chunk-based)')
    console.log(`📷 Camera mode: ${cameraMode}`)
    console.log(`📦 Chunk size: ${chunkSize}`)
    console.log(`📦 Load radius: ${loadRadius} chunks`)
    console.log('Player controls:')
    console.log('  - WASD: Move')
    console.log('  - C: Toggle camera mode (1st/3rd person)')
  }

  /**
   * Initialize FPS mode with tile-based world
   */
  async initializeFPS(): Promise<void> {
    this.gameScene = new GameScene(this.engine)
    const input = this.engine.getInput()
    const camera = this.engine.getRenderer().getCamera() as THREE.PerspectiveCamera

    // Setup tile-based world
    await this.gameScene.initializeWithTiles({
      mode: 'firstperson',
      height: 1.6
    })

    // Create FPS player at origin
    this.fpsPlayer = new FPSPlayer(camera, input)
    this.fpsPlayer.setPosition({ x: 0, y: 1.6, z: 0 })

    // Add player to engine's root entity so it gets updated
    const rootEntity = this.engine.getRootEntity()
    rootEntity.addChild(this.fpsPlayer)

    console.log('✅ FPS Player created and added to engine')

    this.setupEngineListeners()

    console.log('✅ Game initialized (Tile-based FPS mode)')
    console.log('🎮 FPS Controls:')
    console.log('  - W: Forward')
    console.log('  - A: Left')
    console.log('  - S: Back')
    console.log('  - D: Right')
    console.log('  - Mouse: Look around')
    console.log('  - ESC: Unlock mouse')
  }

  /**
   * Setup engine event listeners
   */
  private setupEngineListeners(): void {
    this.engine.on('engine:update', (delta: UpdateDelta) => {
      this.update(delta)
    })

    this.engine.on('input:keydown', (event) => {
      this.handleInput(event.key)
    })
  }

  /**
   * Game update loop
   */
  private async update(delta: UpdateDelta): Promise<void> {
    // Update scene (handles world tile loading and player updates)
    await this.gameScene.update()

    // Sync camera directly to FPS player position and rotation (first person)
    if (this.fpsPlayer) {
      const camera = this.engine.getRenderer().getCamera() as any
      const playerPos = this.fpsPlayer.getTransform().position
      const playerRot = this.fpsPlayer.getTransform().rotation

      // Camera at player eye position
      camera.position.set(playerPos.x, playerPos.y, playerPos.z)

      // Camera rotation matches player rotation
      camera.quaternion.set(playerRot.x, playerRot.y, playerRot.z, playerRot.w)

      // Debug every 30 frames
      if (!('_syncCount' in this)) {
        ;(this as any)._syncCount = 0
      }
      ;(this as any)._syncCount++

      if ((this as any)._syncCount % 30 === 0) {
        console.log(`[SYNC] Camera: (${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)}) | Player: (${playerPos.x.toFixed(2)}, ${playerPos.y.toFixed(2)}, ${playerPos.z.toFixed(2)})`)
      }
    }
  }

  /**
   * Handle keyboard input
   */
  private handleInput(key: string): void {
    const player = this.gameScene.getPlayer()

    switch (key) {
      case 'c':
        // Toggle camera mode
        const currentMode = player.getCameraMode()
        const newMode = currentMode === 'firstperson' ? 'thirdperson' : 'firstperson'
        player.setCameraMode(newMode)
        console.log(`📷 Camera switched to: ${newMode}`)
        break
    }
  }

  /**
   * Start the game
   */
  start(): void {
    this.engine.start()
    console.log('🎮 Game started')
  }

  /**
   * Get engine reference
   */
  getEngine(): Engine {
    return this.engine
  }

  /**
   * Get scene reference
   */
  getScene(): GameScene {
    return this.gameScene
  }

  /**
   * Get chunk streamer (if FPS mode)
   */
  getStreamer(): ChunkStreamer | null {
    return this.chunkStreamer
  }

  /**
   * Cleanup
   */
  dispose(): void {
    if (this.chunkStreamer) {
      this.chunkStreamer.dispose()
    }
    this.gameScene.dispose()
    this.engine.dispose()
  }
}
