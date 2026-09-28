import * as THREE from 'three'
import type { ChunkCoord } from '../systems/ChunkLoader'
import { TextureGenerator } from '../assets/TextureGenerator'

/**
 * Single world tile - 10x10 unit area with deterministic generation
 * Tiles are indexed by (tileX, tileZ) coordinates
 */
export class WorldTile {
  private tileCoord: ChunkCoord
  private tileSize: number = 10
  private group: THREE.Group
  private textureCache: Map<string, THREE.Texture> = new Map()

  constructor(tileCoord: ChunkCoord) {
    this.tileCoord = tileCoord
    this.group = new THREE.Group()
    this.group.position.set(tileCoord.x * this.tileSize, 0, tileCoord.z * this.tileSize)
  }

  /**
   * Generate tile content
   */
  generate(): void {
    // Clear existing
    this.group.clear()

    const worldX = this.tileCoord.x * this.tileSize
    const worldZ = this.tileCoord.z * this.tileSize

    // Deterministic random based on tile coordinate
    const seed = this.tileCoord.x * 73856093 ^ this.tileCoord.z * 19349663
    const rand = (offset: number) => {
      const x = Math.sin(seed + offset) * 10000
      return x - Math.floor(x)
    }

    // Ground tile
    const groundGeo = new THREE.PlaneGeometry(this.tileSize, this.tileSize)

    // Vary texture by tile
    let textureKey = 'stone'
    if (Math.abs(seed % 3) === 1) textureKey = 'dirt'
    else if (Math.abs(seed % 3) === 2) textureKey = 'moss'

    let texture = this.textureCache.get(textureKey)
    if (!texture) {
      if (textureKey === 'dirt') {
        texture = TextureGenerator.generateDirtTexture(256, 256)
      } else if (textureKey === 'moss') {
        texture = TextureGenerator.generateMossTexture(256, 256)
      } else {
        texture = TextureGenerator.generateStoneTexture(256, 256)
      }
      this.textureCache.set(textureKey, texture)
    }

    texture.repeat.set(2, 2)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping

    const groundMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.9,
      metalness: 0.05
    })
    const groundMesh = new THREE.Mesh(groundGeo, groundMat)
    groundMesh.rotation.x = -Math.PI / 2
    groundMesh.receiveShadow = true
    groundMesh.position.y = 0
    this.group.add(groundMesh)

    // Randomly add a single decoration
    if (rand(1) > 0.7) {
      const size = 0.5 + rand(2) * 1.5
      const decGeo = new THREE.BoxGeometry(size, size * 2, size)
      const decMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(rand(3) * 0.1, 0.4, 0.3),
        roughness: 0.8,
        metalness: 0.1
      })
      const decMesh = new THREE.Mesh(decGeo, decMat)
      decMesh.position.set(
        worldX + rand(4) * this.tileSize,
        size,
        worldZ + rand(5) * this.tileSize
      )
      decMesh.castShadow = true
      decMesh.receiveShadow = true
      this.group.add(decMesh)
    }
  }

  getGroup(): THREE.Group {
    return this.group
  }

  getTileCoord(): ChunkCoord {
    return { ...this.tileCoord }
  }

  dispose(): void {
    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose()
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose())
        } else {
          obj.material.dispose()
        }
      }
    })
  }
}
