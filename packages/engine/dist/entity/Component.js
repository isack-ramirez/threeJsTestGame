/**
 * Base class for all components
 */
export class Component {
    constructor(entity) {
        Object.defineProperty(this, "entity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.entity = entity;
    }
    getEntity() {
        return this.entity;
    }
    onEnable() { }
    onDisable() { }
    dispose() { }
}
//# sourceMappingURL=Component.js.map