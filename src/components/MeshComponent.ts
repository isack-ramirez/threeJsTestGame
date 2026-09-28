import { Component, UpdateDelta } from '@darkfantasy/engine'
import { Entity } from '@darkfantasy/engine'
import * as THREE from 'three'

/**
 * Mesh component - syncs entity transform to Three.js mesh
 */
export class MeshComponent extends Component {
  private mesh: THREE.Mesh
  private geometry: THREE.BufferGeometry
  private material: THREE.Material

  constructor(
    entity: Entity,
    geometry: THREE.BufferGeometry,
    material: THREE.Material
  ) {
    super(entity)
    this.geometry = geometry
    this.material = material
    this.mesh = new THREE.Mesh(geometry, material)
    this.syncTransform()
  }

  update(_delta: UpdateDelta): void {
    this.syncTransform()
  }

  private syncTransform(): void {
    const transform = this.entity.getTransform()

    this.mesh.position.set(transform.position.x, transform.position.y, transform.position.z)
    this.mesh.quaternion.set(
      transform.rotation.x,
      transform.rotation.y,
      transform.rotation.z,
      transform.rotation.w
    )
    this.mesh.scale.set(transform.scale.x, transform.scale.y, transform.scale.z)
  }

  getMesh(): THREE.Mesh {
    return this.mesh
  }

  dispose(): void {
    this.geometry.dispose()
    if (Array.isArray(this.material)) {
      this.material.forEach(m => m.dispose())
    } else {
      this.material.dispose()
    }
    super.dispose()
  }
}
