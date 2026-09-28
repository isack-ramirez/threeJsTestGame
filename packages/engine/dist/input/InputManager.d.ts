import { EventEmitter } from '../core/EventEmitter';
/**
 * Input system - handles keyboard, mouse, and other input
 */
export declare class InputManager extends EventEmitter {
    private keysPressed;
    private mousePosition;
    private mouseButtons;
    constructor();
    private setupKeyboardListeners;
    private setupMouseListeners;
    private onKeyDown;
    private onKeyUp;
    private onMouseMove;
    private onMouseDown;
    private onMouseUp;
    isKeyPressed(key: string): boolean;
    getMousePosition(): {
        x: number;
        y: number;
    };
    isMouseButtonPressed(button: number): boolean;
    dispose(): void;
}
//# sourceMappingURL=InputManager.d.ts.map