import { EventEmitter } from '../core/EventEmitter';
/**
 * Input system - handles keyboard, mouse, and other input
 */
export class InputManager extends EventEmitter {
    constructor() {
        super();
        Object.defineProperty(this, "keysPressed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "mousePosition", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { x: 0, y: 0 }
        });
        Object.defineProperty(this, "mouseButtons", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        this.setupKeyboardListeners();
        this.setupMouseListeners();
    }
    setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
        // Debug: log first key press
        let firstKeyLogged = false;
        const origKeyDown = this.onKeyDown.bind(this);
        this.onKeyDown = function (e) {
            if (!firstKeyLogged) {
                console.log('🎮 First key detected:', e.key);
                firstKeyLogged = true;
            }
            return origKeyDown(e);
        };
        console.log('✅ Keyboard listeners attached');
    }
    setupMouseListeners() {
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mousedown', (e) => this.onMouseDown(e));
        window.addEventListener('mouseup', (e) => this.onMouseUp(e));
    }
    onKeyDown(event) {
        const key = event.key.toLowerCase();
        if (!this.keysPressed.has(key)) {
            this.emit('keydown', { key });
        }
        this.keysPressed.set(key, true);
    }
    onKeyUp(event) {
        const key = event.key.toLowerCase();
        this.keysPressed.set(key, false);
        this.emit('keyup', { key });
    }
    onMouseMove(event) {
        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;
        this.emit('mousemove', { x: event.clientX, y: event.clientY });
    }
    onMouseDown(event) {
        this.mouseButtons.set(event.button, true);
        this.emit('mousedown', { button: event.button });
    }
    onMouseUp(event) {
        this.mouseButtons.set(event.button, false);
        this.emit('mouseup', { button: event.button });
    }
    isKeyPressed(key) {
        return this.keysPressed.get(key.toLowerCase()) ?? false;
    }
    getMousePosition() {
        return { ...this.mousePosition };
    }
    isMouseButtonPressed(button) {
        return this.mouseButtons.get(button) ?? false;
    }
    dispose() {
        this.clear();
    }
}
//# sourceMappingURL=InputManager.js.map