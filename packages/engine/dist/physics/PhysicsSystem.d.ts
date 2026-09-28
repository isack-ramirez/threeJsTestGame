import { UpdateDelta } from '../core/types';
import { Entity } from '../entity/Entity';
/**
 * Physics system - handles physics simulation
 *
 * TODO: Integrate with physics library (e.g., Cannon.js, Oimo.js)
 */
export declare class PhysicsSystem {
    private entities;
    private enabled;
    constructor();
    addEntity(entity: Entity): void;
    removeEntity(entity: Entity): void;
    setEnabled(enabled: boolean): void;
    isEnabled(): boolean;
    update(_delta: UpdateDelta): void;
    raycast(_origin: any, _direction: any, _maxDistance: number): any;
    dispose(): void;
}
//# sourceMappingURL=PhysicsSystem.d.ts.map