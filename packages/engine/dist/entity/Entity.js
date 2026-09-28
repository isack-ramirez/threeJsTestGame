/**
 * Entity/GameObject - containers for components
 */
export class Entity {
    constructor(name = 'Entity') {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "components", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "children", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "parent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "transform", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "active", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        this.id = Math.random().toString(36).substr(2, 9);
        this.name = name;
        this.transform = {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0, w: 1 },
            scale: { x: 1, y: 1, z: 1 }
        };
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    getTransform() {
        return this.transform;
    }
    setPosition(position) {
        this.transform.position = { ...this.transform.position, ...position };
    }
    setRotation(rotation) {
        this.transform.rotation = { ...this.transform.rotation, ...rotation };
    }
    setScale(scale) {
        this.transform.scale = { ...this.transform.scale, ...scale };
    }
    addComponent(Component) {
        const component = new Component(this);
        const key = Component.name;
        this.components.set(key, component);
        component.onEnable();
        return component;
    }
    getComponent(ComponentClass) {
        const key = ComponentClass.name;
        return this.components.get(key);
    }
    hasComponent(ComponentClass) {
        const key = ComponentClass.name;
        return this.components.has(key);
    }
    removeComponent(ComponentClass) {
        const key = ComponentClass.name;
        const component = this.components.get(key);
        if (component) {
            component.onDisable();
            component.dispose();
            this.components.delete(key);
        }
    }
    addChild(child) {
        if (child.parent) {
            child.parent.removeChild(child);
        }
        child.parent = this;
        this.children.push(child);
    }
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            child.parent = null;
        }
    }
    getChildren() {
        return [...this.children];
    }
    getParent() {
        return this.parent;
    }
    setActive(active) {
        this.active = active;
    }
    isActive() {
        return this.active;
    }
    update(delta) {
        if (!this.active)
            return;
        this.components.forEach(component => {
            component.update(delta);
        });
        this.children.forEach(child => {
            child.update(delta);
        });
    }
    dispose() {
        this.components.forEach(component => {
            component.dispose();
        });
        this.children.forEach(child => {
            child.dispose();
        });
        this.components.clear();
        this.children = [];
    }
}
//# sourceMappingURL=Entity.js.map