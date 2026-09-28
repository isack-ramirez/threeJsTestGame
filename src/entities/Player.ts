import { Entity } from '@darkfantasy/engine'
import * as THREE from 'three'
import { CameraComponent } from '../components/CameraComponent'
import type { CameraConfig } from '../types'

/**
 * Player entity - Main character with camera and controls
 */
export class Player extends Entity {
  private camera: THREE.PerspectiveCamera
  private cameraComponent: CameraComponent

  constructor(
    camera: THREE.PerspectiveCamera,
    cameraConfig: CameraConfig = { mode: 'thirdperson', distance: 8 }
  ) {
    super('Player')

    this.camera = camera
    this.setPosition({ x: 0, y: 2, z: 0 })

    // Attach camera component
    this.cameraComponent = this.addComponent(
      class extends CameraComponent {
        constructor(entity: Entity) {
          super(entity, camera, cameraConfig)
        }
      }
    )
  }

  getCameraComponent(): CameraComponent {
    return this.cameraComponent
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera
  }

  /**
   * Switch camera mode
   */
  setCameraMode(mode: 'firstperson' | 'thirdperson'): void {
    this.cameraComponent.setMode(mode)
  }

  /**
   * Get current camera mode
   */
  getCameraMode(): 'firstperson' | 'thirdperson' {
    return this.cameraComponent.getMode()
  }

  /**
   * Set camera distance (for third person)
   */
  setCameraDistance(distance: number): void {
    this.cameraComponent.setDistance(distance)
  }

  /**
   * Set camera height (eye level)
   */
  setCameraHeight(height: number): void {
    this.cameraComponent.setHeight(height)
  }
}
