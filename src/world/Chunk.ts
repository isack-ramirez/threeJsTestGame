import * as THREE from 'three'
import { Entity } from '@darkfantasy/engine'
import { WorldTile } from './WorldTile'
import type { ChunkCoord } from '../systems/ChunkLoader'

/**
 * A chunk groups multiple tiles together for organization and optimization
 * Each chunk contains a 5x5 grid of tiles (50x50 world units)
 */
export class Chunk {
  private coord: ChunkCoord
  private tiles: Map<string, WorldTile> = new Map()
  private group: THREE.Group
  private tileSize: number = 10
  private tilesPerChunk: number = 5

  constructor(coord: ChunkCoord) {
    this.coord = coord
    this.group = new THREE.Group()
    this.group.position.set(
      coord.x * this.tilesPerChunk * this.tileSize,
      0,
      coord.z * this.tilesPerChunk * this.tileSize
    )
  }

  /**
   * Generate all tiles in this chunk
   */
  generate(): void {
    for (let tx = 0; tx < this.tilesPerChunk; tx++) {
      for (let tz = 0; tz < this.tilesPerChunk; tz++) {
        const worldTileX = this.coord.x * this.tilesPerChunk + tx
        const worldTileZ = this.coord.z * this.tilesPerChunk + tz

        const tile = new WorldTile({ x: worldTileX, z: worldTileZ })
        tile.generate()

        this.group.add(tile.getGroup())
        this.tiles.set(`${tx},${tz}`, tile)
      }
    }
  }

  /**
   * Get the Three.js group for this chunk
   */
  getGroup(): THREE.Group {
    return this.group
  }

  /**
   * Get chunk coordinate
   */
  getCoord(): ChunkCoord {
    return this.coord
  }

  /**
   * Get tile count
   */
  getTileCount(): number {
    return this.tiles.size
  }

  /**
   * Cleanup
   */
  dispose(): void {
    this.tiles.forEach(tile => tile.dispose())
    this.tiles.clear()
    this.group.clear()
  }
}
