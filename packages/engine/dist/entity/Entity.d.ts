import { Component } from './Component';
import { Transform, UpdateDelta, Vec3, Quaternion } from '../core/types';
/**
 * Entity/GameObject - containers for components
 */
export declare class Entity {
    private id;
    private name;
    private components;
    private children;
    private parent;
    private transform;
    private active;
    constructor(name?: string);
    getId(): string;
    getName(): string;
    setName(name: string): void;
    getTransform(): Transform;
    setPosition(position: Partial<Vec3>): void;
    setRotation(rotation: Partial<Quaternion>): void;
    setScale(scale: Partial<Vec3>): void;
    addComponent<T extends Component>(Component: new (entity: Entity) => T): T;
    getComponent<T extends Component>(ComponentClass: new (entity: Entity) => T): T | undefined;
    hasComponent(ComponentClass: new (entity: Entity) => Component): boolean;
    removeComponent(ComponentClass: new (entity: Entity) => Component): void;
    addChild(child: Entity): void;
    removeChild(child: Entity): void;
    getChildren(): Entity[];
    getParent(): Entity | null;
    setActive(active: boolean): void;
    isActive(): boolean;
    update(delta: UpdateDelta): void;
    dispose(): void;
}
//# sourceMappingURL=Entity.d.ts.map