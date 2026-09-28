import { Entity } from '@darkfantasy/engine'
import { InputManager } from '@darkfantasy/engine'
import * as THREE from 'three'
import { CameraComponent } from '../components/CameraComponent'
import { FPSControllerComponent } from '../components/FPSControllerComponent'

/**
 * First-person player entity with FPS controls
 */
export class FPSPlayer extends Entity {
  private camera: THREE.PerspectiveCamera
  private cameraComponent: CameraComponent
  private controllerComponent: FPSControllerComponent

  constructor(camera: THREE.PerspectiveCamera, input: InputManager) {
    super('FPSPlayer')

    this.camera = camera
    this.setPosition({ x: 0, y: 1.6, z: 0 })

    // Don't use CameraComponent - GameManager syncs camera directly
    // Just attach FPS controller for movement and look
    this.controllerComponent = this.addComponent(
      class extends FPSControllerComponent {
        constructor(entity: Entity) {
          super(entity, input)
        }
      }
    )

    // Store camera component reference for API compatibility
    this.cameraComponent = null as any
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera
  }

  getCameraComponent(): CameraComponent {
    return this.cameraComponent
  }

  getControllerComponent(): FPSControllerComponent {
    return this.controllerComponent
  }

  /**
   * Get forward direction player is looking
   */
  getForwardDirection(): THREE.Vector3 {
    return this.controllerComponent.getForwardDirection()
  }

  /**
   * Check if player is moving
   */
  isMoving(): boolean {
    return this.controllerComponent.isPlayerMoving()
  }

  /**
   * Set movement speed
   */
  setMoveSpeed(speed: number): void {
    this.controllerComponent.setMoveSpeed(speed)
  }

  /**
   * Set look sensitivity
   */
  setLookSensitivity(sensitivity: number): void {
    this.controllerComponent.setLookSensitivity(sensitivity)
  }
}
