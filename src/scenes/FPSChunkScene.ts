import * as THREE from 'three'
import { Player } from '../entities/Player'
import { LoadableScene } from './SceneLoader'
import type { ChunkCoord } from '../systems/ChunkLoader'
import { TextureGenerator } from '../assets/TextureGenerator'

/**
 * FPS-optimized chunk with dark fantasy terrain
 */
export class FPSChunkScene extends LoadableScene {
  private scene: THREE.Scene
  private chunkCoord: ChunkCoord
  private chunkSize: number
  private ground: THREE.Mesh | null = null
  private objects: THREE.Object3D[] = []
  private textureVariants: Map<string, THREE.Texture> = new Map()

  constructor(scene: THREE.Scene, chunkCoord: ChunkCoord, chunkSize: number = 100) {
    const name = `FPSChunk(${chunkCoord.x},${chunkCoord.z})`
    super(name)
    this.scene = scene
    this.chunkCoord = chunkCoord
    this.chunkSize = chunkSize

    this.generateTextures()
  }

  private generateTextures(): void {
    this.textureVariants.set('stone', TextureGenerator.generateStoneTexture())
    this.textureVariants.set('dirt', TextureGenerator.generateDirtTexture())
    this.textureVariants.set('moss', TextureGenerator.generateMossTexture())
    this.textureVariants.set('rock', TextureGenerator.generateRockTexture())
  }

  async load(): Promise<void> {
    this.setupGround()
    this.setupDecorations()
  }

  unload(): void {
    this.ground?.removeFromParent()
    this.objects.forEach(obj => obj.removeFromParent())
  }

  onActivate(_player: Player): void {
    // Called when chunk becomes active
  }

  onDeactivate(): void {
    // Called when chunk becomes inactive
  }

  private setupGround(): void {
    const worldX = this.chunkCoord.x * this.chunkSize
    const worldZ = this.chunkCoord.z * this.chunkSize

    const groundGeometry = new THREE.PlaneGeometry(this.chunkSize, this.chunkSize)

    // Select texture based on chunk coordinate
    let textureKey = 'stone'
    const hash = Math.abs(this.chunkCoord.x * 73856093 ^ this.chunkCoord.z * 19349663)
    if (hash % 3 === 0) textureKey = 'dirt'
    else if (hash % 3 === 1) textureKey = 'moss'

    const texture = this.textureVariants.get(textureKey)!
    texture.repeat.set(4, 4)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping

    const groundMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.9,
      metalness: 0.05
    })

    this.ground = new THREE.Mesh(groundGeometry, groundMaterial)
    this.ground.rotation.x = -Math.PI / 2
    this.ground.position.set(worldX + this.chunkSize / 2, 0, worldZ + this.chunkSize / 2)
    this.ground.receiveShadow = true
    this.addObject(this.ground)
  }

  private setupDecorations(): void {
    const worldX = this.chunkCoord.x * this.chunkSize
    const worldZ = this.chunkCoord.z * this.chunkSize

    // Deterministic random based on chunk coordinate
    const seed = this.chunkCoord.x * 73856093 ^ this.chunkCoord.z * 19349663
    const rand = (offset: number) => {
      const x = Math.sin(seed + offset) * 10000
      return x - Math.floor(x)
    }

    // Add some decorative rocks and pillars
    const numDecorations = 2 + Math.floor(rand(1) * 3)

    for (let i = 0; i < numDecorations; i++) {
      const size = 1 + rand(i * 10) * 3
      const geometry = new THREE.BoxGeometry(size, size * (1 + rand(i * 20)), size)

      const hue = rand(i * 30) * 0.1 // Keep dark color palette
      const saturation = 0.3 + rand(i * 40) * 0.2
      const lightness = 0.2 + rand(i * 50) * 0.1

      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(hue, saturation, lightness),
        roughness: 0.8,
        metalness: 0.1
      })

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(
        worldX + 10 + rand(i * 60) * (this.chunkSize - 20),
        size / 2,
        worldZ + 10 + rand(i * 70) * (this.chunkSize - 20)
      )
      mesh.castShadow = true
      mesh.receiveShadow = true

      this.addObject(mesh)
    }

    // Add some pillars/columns
    const numPillars = Math.floor(rand(100) * 2)
    for (let i = 0; i < numPillars; i++) {
      const pillarHeight = 5 + rand(i * 80) * 5
      const geometry = new THREE.CylinderGeometry(0.8, 0.8, pillarHeight, 8)

      const rockTexture = this.textureVariants.get('rock')!
      const material = new THREE.MeshStandardMaterial({
        map: rockTexture,
        roughness: 0.7,
        metalness: 0.05
      })

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(
        worldX + 20 + rand(i * 90) * (this.chunkSize - 40),
        pillarHeight / 2,
        worldZ + 20 + rand(i * 100) * (this.chunkSize - 40)
      )
      mesh.castShadow = true
      mesh.receiveShadow = true

      this.addObject(mesh)
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
    this.textureVariants.forEach(texture => texture.dispose())
    this.objects = []
    this.textureVariants.clear()
  }
}
