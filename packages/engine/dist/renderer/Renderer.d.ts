import * as THREE from 'three';
import { EngineConfig, UpdateDelta } from '../core/types';
/**
 * Renderer system - handles Three.js scene rendering with Canvas 2D fallback
 */
export declare class Renderer {
    private scene;
    private camera;
    private renderer;
    private canvasRenderer;
    private width;
    private height;
    private useWebGL;
    constructor(config: EngineConfig);
    private initWebGL;
    private initCanvas;
    private setupWindowResize;
    private onWindowResize;
    getScene(): THREE.Scene;
    getCamera(): THREE.Camera;
    getThreeRenderer(): THREE.WebGLRenderer;
    isWebGLAvailable(): boolean;
    render(delta: UpdateDelta): void;
    dispose(): void;
}
//# sourceMappingURL=Renderer.d.ts.map