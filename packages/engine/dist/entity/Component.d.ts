import { Entity } from './Entity';
import { UpdateDelta } from '../core/types';
/**
 * Base class for all components
 */
export declare abstract class Component {
    protected entity: Entity;
    constructor(entity: Entity);
    getEntity(): Entity;
    onEnable(): void;
    onDisable(): void;
    abstract update(delta: UpdateDelta): void;
    dispose(): void;
}
//# sourceMappingURL=Component.d.ts.map