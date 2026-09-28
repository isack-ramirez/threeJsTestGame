import * as THREE from 'three'
import { Player } from '../entities/Player'
import { LoadableScene } from './SceneLoader'
import type { ChunkCoord } from '../systems/ChunkLoader'

/**
 * Chunk-based scene for streaming worlds
 * Each chunk represents a grid cell in the world
 */
export class ChunkScene extends LoadableScene {
  private scene: THREE.Scene
  private chunkCoord: ChunkCoord
  private chunkSize: number
  private ground: THREE.Mesh | null = null
  private decorations: THREE.Object3D[] = []
  private objects: THREE.Object3D[] = []

  constructor(scene: THREE.Scene, chunkCoord: ChunkCoord, chunkSize: number = 100) {
    const name = `Chunk(${chunkCoord.x},${chunkCoord.z})`
    super(name)
    this.scene = scene
    this.chunkCoord = chunkCoord
    this.chunkSize = chunkSize
  }

  async load(): Promise<void> {
    this.setupGround()
    this.setupDecorations()
    console.log(`✅ ${this.name} loaded`)
  }

  unload(): void {
    this.ground?.removeFromParent()
    this.decorations.forEach(obj => obj.removeFromParent())
    this.ground = null
    this.decorations = []
  }

  onActivate(player: Player): void {
    console.log(`🎬 ${this.name} activated`)
  }

  onDeactivate(): void {
    console.log(`🎬 ${this.name} deactivated`)
  }

  private setupGround(): void {
    const worldX = this.chunkCoord.x * this.chunkSize
    const worldZ = this.chunkCoord.z * this.chunkSize

    const groundGeometry = new THREE.PlaneGeometry(this.chunkSize, this.chunkSize)
    const color = new THREE.Color()
    color.setHSL((this.chunkCoord.x + this.chunkCoord.z) * 0.05, 0.5, 0.5)

    const groundMaterial = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.8,
      metalness: 0.1
    })
    this.ground = new THREE.Mesh(groundGeometry, groundMaterial)
    this.ground.rotation.x = -Math.PI / 2
    this.ground.position.set(worldX + this.chunkSize / 2, 0, worldZ + this.chunkSize / 2)
    this.ground.receiveShadow = true
    this.addObject(this.ground)
  }

  private setupDecorations(): void {
    // Add some random cubes as decorations
    const numDecorations = 3 + Math.floor(Math.random() * 3)

    for (let i = 0; i < numDecorations; i++) {
      const size = 2 + Math.random() * 3
      const geometry = new THREE.BoxGeometry(size, size, size)
      const hue = (this.chunkCoord.x * 0.3 + this.chunkCoord.z * 0.7 + i) % 1
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(hue, 0.7, 0.5),
        roughness: 0.4,
        metalness: 0.3
      })
      const mesh = new THREE.Mesh(geometry, material)

      const worldX = this.chunkCoord.x * this.chunkSize
      const worldZ = this.chunkCoord.z * this.chunkSize
      mesh.position.set(
        worldX + Math.random() * this.chunkSize,
        size / 2,
        worldZ + Math.random() * this.chunkSize
      )
      mesh.castShadow = true
      mesh.receiveShadow = true

      this.addObject(mesh)
      this.decorations.push(mesh)
    }
  }

  getChunkCoord(): ChunkCoord {
    return { ...this.chunkCoord }
  }

  private addObject(obj: THREE.Object3D): void {
    this.scene.add(obj)
    this.objects.push(obj)
  }

  dispose(): void {
    this.unload()
    this.objects.forEach(obj => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry?.dispose()
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose())
        } else {
          obj.material?.dispose()
        }
      }
    })
    this.objects = []
  }
}
