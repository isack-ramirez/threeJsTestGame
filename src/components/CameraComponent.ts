import { Component, UpdateDelta } from '@darkfantasy/engine'
import { Entity } from '@darkfantasy/engine'
import * as THREE from 'three'
import type { CameraConfig } from '../types'

/**
 * Camera component - Handles first/third person camera following an entity
 */
export class CameraComponent extends Component {
  private camera: THREE.PerspectiveCamera
  private mode: CameraConfig['mode']
  private distance: number
  private height: number
  private offset: THREE.Vector3
  private currentPos: THREE.Vector3
  private targetPos: THREE.Vector3
  private smoothSpeed: number = 5

  constructor(entity: Entity, camera: THREE.PerspectiveCamera, config: CameraConfig) {
    super(entity)
    this.camera = camera
    this.mode = config.mode
    this.distance = config.distance ?? 8
    this.height = config.height ?? 1.6
    this.offset = new THREE.Vector3(config.offset?.x ?? 0, config.offset?.y ?? 0, config.offset?.z ?? 0)
    this.currentPos = new THREE.Vector3()
    this.targetPos = new THREE.Vector3()

    this.updateCameraPosition()
  }

  update(delta: UpdateDelta): void {
    const transform = this.entity.getTransform()
    const entityPos = new THREE.Vector3(transform.position.x, transform.position.y, transform.position.z)

    if (this.mode === 'firstperson') {
      this.updateFirstPerson(entityPos, delta)
    } else {
      this.updateThirdPerson(entityPos, delta)
    }

    this.camera.position.copy(this.currentPos)
    this.camera.lookAt(entityPos.clone().add(new THREE.Vector3(0, this.height, 0)))

    // Debug every 10 frames
    if (!('_frameCount' in this)) {
      ;(this as any)._frameCount = 0
    }
    ;(this as any)._frameCount++

    if ((this as any)._frameCount % 10 === 0) {
      console.log(`📷 Camera: (${this.camera.position.x.toFixed(1)}, ${this.camera.position.y.toFixed(1)}, ${this.camera.position.z.toFixed(1)}) | Entity: (${entityPos.x.toFixed(1)}, ${entityPos.y.toFixed(1)}, ${entityPos.z.toFixed(1)})`)
    }
  }

  private updateFirstPerson(entityPos: THREE.Vector3, delta: UpdateDelta): void {
    this.targetPos.copy(entityPos)
    this.targetPos.y += this.height
    this.targetPos.add(this.offset)

    this.currentPos.lerp(this.targetPos, delta.deltaTime * this.smoothSpeed)
  }

  private updateThirdPerson(entityPos: THREE.Vector3, delta: UpdateDelta): void {
    const forward = new THREE.Vector3(0, 0, 1)
    const quaternion = new THREE.Quaternion(
      this.entity.getTransform().rotation.x,
      this.entity.getTransform().rotation.y,
      this.entity.getTransform().rotation.z,
      this.entity.getTransform().rotation.w
    )
    forward.applyQuaternion(quaternion)
    forward.multiplyScalar(this.distance)

    this.targetPos.copy(entityPos)
    this.targetPos.add(forward)
    this.targetPos.y += this.height
    this.targetPos.add(this.offset)

    this.currentPos.lerp(this.targetPos, delta.deltaTime * this.smoothSpeed)
  }

  setMode(mode: CameraConfig['mode']): void {
    this.mode = mode
  }

  getMode(): CameraConfig['mode'] {
    return this.mode
  }

  setDistance(distance: number): void {
    this.distance = distance
  }

  setHeight(height: number): void {
    this.height = height
  }

  private updateCameraPosition(): void {
    this.currentPos.copy(this.camera.position)
  }

  dispose(): void {
    super.dispose()
  }
}
