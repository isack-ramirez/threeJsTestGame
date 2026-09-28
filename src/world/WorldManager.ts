import * as THREE from 'three'
import { Entity } from '@darkfantasy/engine'
import { Chunk } from './Chunk'
import type { ChunkCoord } from '../systems/ChunkLoader'

/**
 * Manages the world chunk system
 * Loads/unloads chunks based on player position
 * Each chunk contains 5x5 tiles (50x50 world units)
 */
export class WorldManager {
  private scene: THREE.Scene
  private player: Entity
  private chunks: Map<string, Chunk> = new Map()
  private activeChunks: Set<string> = new Set()
  private tileSize: number = 10
  private tilesPerChunk: number = 5
  private chunkSize: number = this.tileSize * this.tilesPerChunk // 50 units
  private chunkLoadRadius: number = 4 // Load 9x9 chunks (~45x45 tiles, ~450 units)
  private lastPlayerChunk: ChunkCoord | null = null

  constructor(scene: THREE.Scene, player: Entity) {
    this.scene = scene
    this.player = player
  }

  /**
   * Update - call every frame
   */
  update(): void {
    const playerPos = this.player.getTransform().position
    const playerChunk = this.getChunkAtPosition(playerPos.x, playerPos.z)

    // Check if player moved to new chunk
    if (
      !this.lastPlayerChunk ||
      playerChunk.x !== this.lastPlayerChunk.x ||
      playerChunk.z !== this.lastPlayerChunk.z
    ) {
      console.log(`🗺️ Player chunk: (${playerChunk.x}, ${playerChunk.z}), pos: (${playerPos.x.toFixed(1)}, ${playerPos.z.toFixed(1)})`)
      this.lastPlayerChunk = playerChunk
      this.updateChunks(playerChunk)
      console.log(`📦 Active chunks: ${this.activeChunks.size} (~${this.activeChunks.size * 25} tiles)`)
    }
  }

  /**
   * Get chunk coordinate for world position
   */
  private getChunkAtPosition(x: number, z: number): ChunkCoord {
    return {
      x: Math.floor(x / this.chunkSize),
      z: Math.floor(z / this.chunkSize)
    }
  }

  /**
   * Update loaded chunks based on player position
   */
  private updateChunks(playerChunk: ChunkCoord): void {
    const chunksToLoad = new Set<string>()

    // Generate chunk keys to load
    for (let x = playerChunk.x - this.chunkLoadRadius; x <= playerChunk.x + this.chunkLoadRadius; x++) {
      for (let z = playerChunk.z - this.chunkLoadRadius; z <= playerChunk.z + this.chunkLoadRadius; z++) {
        const key = `${x},${z}`
        chunksToLoad.add(key)
      }
    }

    // Unload chunks outside radius
    for (const key of this.activeChunks) {
      if (!chunksToLoad.has(key)) {
        this.unloadChunk(key)
      }
    }

    // Load chunks inside radius
    for (const key of chunksToLoad) {
      if (!this.activeChunks.has(key)) {
        this.loadChunk(key)
      }
    }
  }

  /**
   * Load a chunk
   */
  private loadChunk(key: string): void {
    const [x, z] = key.split(',').map(Number)
    const chunk = new Chunk({ x, z })
    chunk.generate()
    this.scene.add(chunk.getGroup())
    this.chunks.set(key, chunk)
    this.activeChunks.add(key)
  }

  /**
   * Unload a chunk
   */
  private unloadChunk(key: string): void {
    const chunk = this.chunks.get(key)
    if (chunk) {
      this.scene.remove(chunk.getGroup())
      chunk.dispose()
      this.chunks.delete(key)
      this.activeChunks.delete(key)
    }
  }

  /**
   * Dispose all chunks
   */
  dispose(): void {
    for (const chunk of this.chunks.values()) {
      chunk.dispose()
    }
    this.chunks.clear()
    this.activeChunks.clear()
  }
}
