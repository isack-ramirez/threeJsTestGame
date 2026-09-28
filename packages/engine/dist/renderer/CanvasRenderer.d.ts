import { EngineConfig, UpdateDelta } from '../core/types';
/**
 * Fallback Canvas 2D renderer when WebGL is unavailable
 * Simple orthographic renderer for debugging/fallback
 */
export declare class CanvasRenderer {
    private canvas;
    private ctx;
    private width;
    private height;
    constructor(config: EngineConfig);
    private setupWindowResize;
    private onWindowResize;
    render(_delta: UpdateDelta): void;
    dispose(): void;
}
//# sourceMappingURL=CanvasRenderer.d.ts.map