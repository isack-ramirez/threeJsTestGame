import { Entity } from '@darkfantasy/engine'
import { ChunkLoader, type ChunkCoord } from '../systems/ChunkLoader'
import * as THREE from 'three'

/**
 * Chunk Streamer - Coordinates player position with visible chunks
 * Handles frustum culling and LOD
 */
export class ChunkStreamer {
  private chunkLoader: ChunkLoader
  private player: Entity
  private camera: THREE.Camera
  private frustum: THREE.Frustum = new THREE.Frustum()
  private frustumMatrix: THREE.Matrix4 = new THREE.Matrix4()
  private culledChunks: Set<string> = new Set()
  private lastPlayerChunk: ChunkCoord | null = null
  private chunkSize: number

  constructor(
    chunkLoader: ChunkLoader,
    player: Entity,
    camera: THREE.Camera,
    chunkSize: number = 100
  ) {
    this.chunkLoader = chunkLoader
    this.player = player
    this.camera = camera
    this.chunkSize = chunkSize
  }

  /**
   * Update streamer (call every frame)
   * Handles chunk loading and frustum culling
   */
  async update(): Promise<void> {
    const playerPos = this.player.getTransform().position
    const currentChunk = this.getChunkAtPosition(playerPos.x, playerPos.z)

    // Debug first frame
    if (!('_debugLogged' in this)) {
      console.log('🎯 Streamer first update')
      console.log('Player position:', playerPos)
      console.log('Player chunk:', currentChunk)
      console.log('Camera position:', this.camera.position)
      ;(this as any)._debugLogged = true
    }

    // Check if player moved to new chunk
    if (
      !this.lastPlayerChunk ||
      currentChunk.x !== this.lastPlayerChunk.x ||
      currentChunk.z !== this.lastPlayerChunk.z
    ) {
      console.log(`📍 Player chunk: (${currentChunk.x}, ${currentChunk.z})`)
      this.lastPlayerChunk = currentChunk
    }

    // Update chunk loader
    await this.chunkLoader.update()

    // Perform frustum culling
    this.updateFrustumCulling()
  }

  /**
   * Update frustum from camera
   */
  private updateFrustumCulling(): void {
    const projScreenMatrix = new THREE.Matrix4()
    projScreenMatrix.multiplyMatrices(
      this.camera.projectionMatrix,
      this.camera.matrixWorldInverse
    )
    this.frustum.setFromProjectionMatrix(projScreenMatrix)
  }

  /**
   * Get chunk coordinate for world position
   */
  private getChunkAtPosition(worldX: number, worldZ: number): ChunkCoord {
    return {
      x: Math.floor(worldX / this.chunkSize),
      z: Math.floor(worldZ / this.chunkSize)
    }
  }

  /**
   * Get player's current chunk
   */
  getPlayerChunk(): ChunkCoord {
    const playerPos = this.player.getTransform().position
    return this.getChunkAtPosition(playerPos.x, playerPos.z)
  }

  /**
   * Check if chunk is visible (in frustum)
   */
  isChunkVisible(chunkCoord: ChunkCoord): boolean {
    // Create bounding box for chunk
    const chunkMinX = chunkCoord.x * this.chunkSize
    const chunkMinZ = chunkCoord.z * this.chunkSize
    const chunkMaxX = chunkMinX + this.chunkSize
    const chunkMaxZ = chunkMinZ + this.chunkSize

    const box = new THREE.Box3(
      new THREE.Vector3(chunkMinX, -100, chunkMinZ),
      new THREE.Vector3(chunkMaxX, 100, chunkMaxZ)
    )

    return this.frustum.intersectsBox(box)
  }

  /**
   * Get list of visible chunks
   */
  getVisibleChunks(): string[] {
    const activeChunks = this.chunkLoader.getActiveChunks()
    return activeChunks.filter(chunkKey => {
      const [x, z] = chunkKey.split(',').map(Number)
      return this.isChunkVisible({ x, z })
    })
  }

  /**
   * Get debugging info
   */
  getDebugInfo(): {
    playerChunk: ChunkCoord
    loadedChunks: number
    visibleChunks: number
    playerPosition: { x: number; z: number }
  } {
    const playerPos = this.player.getTransform().position
    return {
      playerChunk: this.getPlayerChunk(),
      loadedChunks: this.chunkLoader.getActiveChunks().length,
      visibleChunks: this.getVisibleChunks().length,
      playerPosition: { x: playerPos.x, z: playerPos.z }
    }
  }

  /**
   * Set chunk load radius (LOD adjustment)
   */
  setLoadRadius(radius: number): void {
    this.chunkLoader.setLoadRadius(radius)
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.chunkLoader.dispose()
    this.culledChunks.clear()
  }
}
