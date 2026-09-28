import { Component, UpdateDelta, InputManager } from '@darkfantasy/engine'
import { Entity } from '@darkfantasy/engine'
import * as THREE from 'three'

/**
 * FPS Controller - Standard WASD movement + mouse look
 */
export class FPSControllerComponent extends Component {
  private input: InputManager
  private velocity: THREE.Vector3 = new THREE.Vector3()
  private euler: THREE.Euler = new THREE.Euler(0, 0, 0, 'YXZ')
  private pi_2 = Math.PI / 2

  // Movement
  private moveSpeed: number = 10 // Units per second (increased)
  private acceleration: number = 2 // (increased)
  private deceleration: number = 0.3

  // Looking
  private lookSensitivity: number = 0.003
  private maxPitch: number = this.pi_2 - 0.1

  // State
  private isMoving: boolean = false
  private pitch: number = 0
  private yaw: number = 0
  private lastMouseX: number = 0
  private lastMouseY: number = 0

  constructor(entity: Entity, input: InputManager) {
    super(entity)
    this.input = input
    this.setupMouseTracking()
  }

  private setupMouseTracking(): void {
    document.addEventListener('mousemove', (e) => {
      const deltaX = e.movementX || 0
      const deltaY = e.movementY || 0

      if (deltaX !== 0 || deltaY !== 0) {
        this.lastMouseX = deltaX
        this.lastMouseY = deltaY
      }
    })
  }

  update(delta: UpdateDelta): void {
    this.handleMouseLook(delta)
    this.handleMovement(delta)
    this.applyMovement(delta)

    // Debug every 10 frames
    if (!('_frameCount' in this)) {
      ;(this as any)._frameCount = 0
    }
    ;(this as any)._frameCount++

    if ((this as any)._frameCount % 10 === 0) {
      const pos = this.entity.getTransform().position
      const vel = this.velocity.length()
      console.log(`[FPS] Pos: (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}), Vel: ${vel.toFixed(2)}, Moving: ${this.isMoving}`)
    }
  }

  /**
   * Handle mouse look (yaw and pitch)
   */
  private handleMouseLook(_delta: UpdateDelta): void {
    // Use actual mouse movement delta from mousemove event
    this.yaw -= this.lastMouseX * this.lookSensitivity
    this.pitch -= this.lastMouseY * this.lookSensitivity
    this.lastMouseX = 0
    this.lastMouseY = 0

    // Clamp pitch
    this.pitch = Math.max(-this.maxPitch, Math.min(this.maxPitch, this.pitch))

    // Apply rotation to entity
    this.euler.set(this.pitch, this.yaw, 0, 'YXZ')
    const quat = new THREE.Quaternion()
    quat.setFromEuler(this.euler)
    this.entity.setRotation({
      x: quat.x,
      y: quat.y,
      z: quat.z,
      w: quat.w
    })
  }

  /**
   * Handle keyboard movement (WASD)
   */
  private handleMovement(delta: UpdateDelta): void {
    const moveDir = new THREE.Vector3()

    // Calculate forward from yaw only (no pitch for movement)
    // This ensures movement direction updates when camera rotates
    const forward = new THREE.Vector3(
      -Math.sin(this.yaw),
      0,
      -Math.cos(this.yaw)
    )

    // Right = perpendicular to forward
    const right = new THREE.Vector3(
      Math.cos(this.yaw),
      0,
      -Math.sin(this.yaw)
    )

    // WASD input
    if (this.input.isKeyPressed('w')) moveDir.add(forward)
    if (this.input.isKeyPressed('s')) moveDir.add(forward.clone().multiplyScalar(-1))
    if (this.input.isKeyPressed('a')) moveDir.add(right.clone().multiplyScalar(-1))
    if (this.input.isKeyPressed('d')) moveDir.add(right)

    // Normalize diagonal movement
    if (moveDir.length() > 0) {
      moveDir.normalize()
      this.isMoving = true
    } else {
      this.isMoving = false
    }

    // Set velocity directly (snappy, no momentum)
    if (this.isMoving) {
      this.velocity.copy(moveDir.multiplyScalar(this.moveSpeed))
    } else {
      this.velocity.multiplyScalar(0)
    }
  }

  /**
   * Apply velocity to entity position
   */
  private applyMovement(delta: UpdateDelta): void {
    const currentPos = this.entity.getTransform().position
    const displacement = this.velocity.clone().multiplyScalar(delta.deltaTime)

    const newX = currentPos.x + displacement.x
    const newZ = currentPos.z + displacement.z

    this.entity.setPosition({
      x: newX,
      y: currentPos.y,
      z: newZ
    })

    // Debug every 30 frames
    if (!('_applyCount' in this)) {
      ;(this as any)._applyCount = 0
    }
    ;(this as any)._applyCount++

    if ((this as any)._applyCount % 30 === 0) {
      const checkPos = this.entity.getTransform().position
      console.log(`[APPLY] Set: (${newX.toFixed(2)}, ${newZ.toFixed(2)}) → Got back: (${checkPos.x.toFixed(2)}, ${checkPos.z.toFixed(2)})`)
    }
  }

  /**
   * Set movement speed
   */
  setMoveSpeed(speed: number): void {
    this.moveSpeed = speed
  }

  /**
   * Set look sensitivity (mouse)
   */
  setLookSensitivity(sensitivity: number): void {
    this.lookSensitivity = sensitivity
  }

  /**
   * Get current velocity
   */
  getVelocity(): THREE.Vector3 {
    return this.velocity.clone()
  }

  /**
   * Get forward direction
   */
  getForwardDirection(): THREE.Vector3 {
    const forward = new THREE.Vector3(0, 0, 1)
    const quat = new THREE.Quaternion(
      this.entity.getTransform().rotation.x,
      this.entity.getTransform().rotation.y,
      this.entity.getTransform().rotation.z,
      this.entity.getTransform().rotation.w
    )
    forward.applyQuaternion(quat)
    return forward.normalize()
  }

  /**
   * Check if moving
   */
  isPlayerMoving(): boolean {
    return this.isMoving
  }

  dispose(): void {
    super.dispose()
  }
}
