import { Renderer } from './renderer/Renderer';
import { PhysicsSystem } from './physics/PhysicsSystem';
import { AudioManager } from './audio/AudioManager';
import { InputManager } from './input/InputManager';
import { AssetManager } from './assetManager/AssetManager';
import { Entity } from './entity/Entity';
import { EngineConfig, UpdateDelta } from './core/types';
import { EventEmitter } from './core/EventEmitter';
/**
 * Main engine class - orchestrates all subsystems
 */
export declare class Engine extends EventEmitter {
    private renderer;
    private physics;
    private audio;
    private input;
    private assetManager;
    private rootEntity;
    private isRunning;
    private animationFrameId;
    private lastTime;
    private deltaTime;
    private elapsedTime;
    constructor(config?: EngineConfig);
    private setupInputListeners;
    /**
     * Get access to subsystems
     */
    getRenderer(): Renderer;
    getPhysics(): PhysicsSystem;
    getAudio(): AudioManager;
    getInput(): InputManager;
    getAssetManager(): AssetManager;
    getRootEntity(): Entity;
    /**
     * Create and register a new entity
     */
    createEntity(name?: string): Entity;
    /**
     * Start the engine update loop
     */
    start(): void;
    /**
     * Stop the engine update loop
     */
    stop(): void;
    /**
     * Main update loop
     */
    private update;
    /**
     * Get current frame time info
     */
    getDelta(): UpdateDelta;
    /**
     * Clean up engine resources
     */
    dispose(): void;
}
//# sourceMappingURL=Engine.d.ts.map