import { Component } from './Component'
import { Transform, UpdateDelta, Vec3, Quaternion } from '../core/types'

/**
 * Entity/GameObject - containers for components
 */
export class Entity {
  private id: string
  private name: string
  private components: Map<string, Component> = new Map()
  private children: Entity[] = []
  private parent: Entity | null = null
  private transform: Transform
  private active: boolean = true

  constructor(name: string = 'Entity') {
    this.id = Math.random().toString(36).substr(2, 9)
    this.name = name
    this.transform = {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 1, y: 1, z: 1 }
    }
  }

  getId(): string {
    return this.id
  }

  getName(): string {
    return this.name
  }

  setName(name: string): void {
    this.name = name
  }

  getTransform(): Transform {
    return this.transform
  }

  setPosition(position: Partial<Vec3>): void {
    this.transform.position = { ...this.transform.position, ...position }
  }

  setRotation(rotation: Partial<Quaternion>): void {
    this.transform.rotation = { ...this.transform.rotation, ...rotation }
  }

  setScale(scale: Partial<Vec3>): void {
    this.transform.scale = { ...this.transform.scale, ...scale }
  }

  addComponent<T extends Component>(Component: new (entity: Entity) => T): T {
    const component = new Component(this)
    const key = Component.name
    this.components.set(key, component)
    component.onEnable()
    return component
  }

  getComponent<T extends Component>(ComponentClass: new (entity: Entity) => T): T | undefined {
    const key = ComponentClass.name
    return this.components.get(key) as T | undefined
  }

  hasComponent(ComponentClass: new (entity: Entity) => Component): boolean {
    const key = ComponentClass.name
    return this.components.has(key)
  }

  removeComponent(ComponentClass: new (entity: Entity) => Component): void {
    const key = ComponentClass.name
    const component = this.components.get(key)
    if (component) {
      component.onDisable()
      component.dispose()
      this.components.delete(key)
    }
  }

  addChild(child: Entity): void {
    if (child.parent) {
      child.parent.removeChild(child)
    }
    child.parent = this
    this.children.push(child)
  }

  removeChild(child: Entity): void {
    const index = this.children.indexOf(child)
    if (index > -1) {
      this.children.splice(index, 1)
      child.parent = null
    }
  }

  getChildren(): Entity[] {
    return [...this.children]
  }

  getParent(): Entity | null {
    return this.parent
  }

  setActive(active: boolean): void {
    this.active = active
  }

  isActive(): boolean {
    return this.active
  }

  update(delta: UpdateDelta): void {
    if (!this.active) return

    this.components.forEach(component => {
      component.update(delta)
    })

    this.children.forEach(child => {
      child.update(delta)
    })
  }

  dispose(): void {
    this.components.forEach(component => {
      component.dispose()
    })
    this.children.forEach(child => {
      child.dispose()
    })
    this.components.clear()
    this.children = []
  }
}
