import * as THREE from 'three'
import { Player } from '../entities/Player'
import { LoadableScene } from './SceneLoader'

/**
 * Example scene implementation
 * Can be used standalone or with SceneLoader
 */
export class DemoScene extends LoadableScene {
  private scene: THREE.Scene
  private lights: THREE.Light[] = []
  private ground: THREE.Mesh | null = null
  private objects: THREE.Object3D[] = []

  constructor(scene: THREE.Scene) {
    super('DemoScene')
    this.scene = scene
  }

  async load(): Promise<void> {
    this.setupLighting()
    this.setupGround()
    console.log('✅ DemoScene loaded')
  }

  unload(): void {
    this.lights.forEach(light => light.removeFromParent())
    this.ground?.removeFromParent()
    this.lights = []
    this.ground = null
  }

  onActivate(player: Player): void {
    // Called when scene becomes active
    console.log('🎬 DemoScene activated')
  }

  onDeactivate(): void {
    // Called when scene becomes inactive
    console.log('🎬 DemoScene deactivated')
  }

  private addObject(obj: THREE.Object3D): void {
    this.scene.add(obj)
    this.objects.push(obj)
  }

  private setupLighting(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    this.addObject(ambientLight)
    this.lights.push(ambientLight)

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(50, 50, 50)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.left = -100
    directionalLight.shadow.camera.right = 100
    directionalLight.shadow.camera.top = 100
    directionalLight.shadow.camera.bottom = -100
    this.addObject(directionalLight)
    this.lights.push(directionalLight)
  }

  private setupGround(): void {
    const groundGeometry = new THREE.PlaneGeometry(200, 200)
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a3e,
      roughness: 0.8,
      metalness: 0.1
    })
    this.ground = new THREE.Mesh(groundGeometry, groundMaterial)
    this.ground.rotation.x = -Math.PI / 2
    this.ground.receiveShadow = true
    this.addObject(this.ground)
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
