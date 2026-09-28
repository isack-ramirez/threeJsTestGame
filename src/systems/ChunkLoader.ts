import * as THREE from 'three'
import { Player } from '../entities/Player'
import { LoadableScene } from './SceneLoader'

/**
 * Chunk coordinate system
 */
export interface ChunkCoord {
  x: number
  z: number
}

/**
 * Chunk loader for streaming worlds
 * Loads/unloads chunks based on player position
 */
export class ChunkLoader {
  private chunks: Map<string, LoadableScene> = new Map()
  private activeChunks: Set<string> = new Set()
  private loadedChunks: Map<string, LoadableScene> = new Map()
  private scene: THREE.Scene
  private player: Player
  private chunkSize: number
  private loadRadius: number // How many chunks away to load
  private chunkFactory: (coord: ChunkCoord) => Promise<LoadableScene>

  constructor(
    scene: THREE.Scene,
    player: Player,
    chunkSize: number = 100,
    loadRadius: number = 1,
    chunkFactory: (coord: ChunkCoord) => Promise<LoadableScene>
  ) {
    this.scene = scene
    this.player = player
    this.chunkSize = chunkSize
    this.loadRadius = loadRadius
    this.chunkFactory = chunkFactory
  }

  /**
   * Convert world position to chunk coordinate
   */
  private positionToChunk(x: number, z: number): ChunkCoord {
    return {
      x: Math.floor(x / this.chunkSize),
      z: Math.floor(z / this.chunkSize)
    }
  }

  /**
   * Generate key for chunk coordinate
   */
  private chunkKey(coord: ChunkCoord): string {
    return `${coord.x},${coord.z}`
  }

  /**
   * Get all chunk coordinates within load radius
   */
  private getChunksInRadius(playerChunk: ChunkCoord): ChunkCoord[] {
    const chunks: ChunkCoord[] = []
    for (let x = playerChunk.x - this.loadRadius; x <= playerChunk.x + this.loadRadius; x++) {
      for (let z = playerChunk.z - this.loadRadius; z <= playerChunk.z + this.loadRadius; z++) {
        chunks.push({ x, z })
      }
    }
    return chunks
  }

  /**
   * Update chunk loading based on player position
   * Call this every frame in the update loop
   */
  async update(): Promise<void> {
    const playerPos = this.player.getTransform().position
    const playerChunk = this.positionToChunk(playerPos.x, playerPos.z)
    const chunksInRadius = this.getChunksInRadius(playerChunk)
    const chunksInRadiusKeys = new Set(chunksInRadius.map(c => this.chunkKey(c)))

    // Unload chunks outside radius
    for (const key of this.activeChunks) {
      if (!chunksInRadiusKeys.has(key)) {
        await this.unloadChunk(key)
      }
    }

    // Load chunks inside radius
    for (const coord of chunksInRadius) {
      const key = this.chunkKey(coord)
      if (!this.activeChunks.has(key)) {
        await this.loadChunk(coord)
      }
    }
  }

  /**
   * Load a specific chunk
   */
  private async loadChunk(coord: ChunkCoord): Promise<void> {
    const key = this.chunkKey(coord)

    // Skip if already loaded or loading
    if (this.activeChunks.has(key)) return
    if (this.loadedChunks.has(key)) {
      const chunk = this.loadedChunks.get(key)!
      chunk.onActivate(this.player)
      this.activeChunks.add(key)
      return
    }

    try {
      const chunk = await this.chunkFactory(coord)
      await chunk.load()
      chunk.onActivate(this.player)
      this.loadedChunks.set(key, chunk)
      this.activeChunks.add(key)
      console.log(`📦 Loaded chunk ${key}`)
    } catch (error) {
      console.error(`Failed to load chunk ${key}:`, error)
    }
  }

  /**
   * Unload a specific chunk
   */
  private async unloadChunk(key: string): Promise<void> {
    if (!this.activeChunks.has(key)) return

    const chunk = this.loadedChunks.get(key)
    if (chunk) {
      chunk.onDeactivate()
      this.activeChunks.delete(key)
      console.log(`📦 Unloaded chunk ${key}`)
    }
  }

  /**
   * Pre-load chunks (useful for initialization)
   */
  async preloadChunks(centerChunk: ChunkCoord, radius: number): Promise<void> {
    const chunks = this.getChunksInRadius(centerChunk)
    const promises = chunks.map(c => this.loadChunk(c))
    await Promise.all(promises)
  }

  /**
   * Get list of active chunk keys
   */
  getActiveChunks(): string[] {
    return Array.from(this.activeChunks)
  }

  /**
   * Set load radius (triggers update next frame)
   */
  setLoadRadius(radius: number): void {
    this.loadRadius = Math.max(0, radius)
  }

  /**
   * Dispose all chunks and clear memory
   */
  dispose(): void {
    for (const chunk of this.loadedChunks.values()) {
      chunk.dispose()
    }
    this.chunks.clear()
    this.loadedChunks.clear()
    this.activeChunks.clear()
  }
}
