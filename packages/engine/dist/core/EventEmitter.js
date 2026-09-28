/**
 * Simple event emitter for the engine
 */
export class EventEmitter {
    constructor() {
        Object.defineProperty(this, "listeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }
    off(event, callback) {
        if (!this.listeners.has(event))
            return;
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }
    emit(event, ...args) {
        if (!this.listeners.has(event))
            return;
        const callbacks = this.listeners.get(event);
        callbacks.forEach(cb => cb(...args));
    }
    once(event, callback) {
        const wrapper = (...args) => {
            callback(...args);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
    clear() {
        this.listeners.clear();
    }
}
//# sourceMappingURL=EventEmitter.js.map