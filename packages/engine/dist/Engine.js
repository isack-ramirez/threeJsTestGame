import { Renderer } from './renderer/Renderer';
import { PhysicsSystem } from './physics/PhysicsSystem';
import { AudioManager } from './audio/AudioManager';
import { InputManager } from './input/InputManager';
import { AssetManager } from './assetManager/AssetManager';
import { Entity } from './entity/Entity';
import { EventEmitter } from './core/EventEmitter';
/**
 * Main engine class - orchestrates all subsystems
 */
export class Engine extends EventEmitter {
    constructor(config = {}) {
        super();
        Object.defineProperty(this, "renderer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "physics", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "audio", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "input", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "assetManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "rootEntity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isRunning", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "animationFrameId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "lastTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "deltaTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "elapsedTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        /**
         * Main update loop
         */
        Object.defineProperty(this, "update", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                if (!this.isRunning)
                    return;
                const now = performance.now();
                this.deltaTime = (now - this.lastTime) / 1000; // Convert to seconds
                this.lastTime = now;
                this.elapsedTime += this.deltaTime;
                const delta = {
                    deltaTime: this.deltaTime,
                    elapsedTime: this.elapsedTime
                };
                // Update all systems
                this.physics.update(delta);
                this.rootEntity.update(delta);
                this.renderer.render(delta);
                this.emit('engine:update', delta);
                this.animationFrameId = requestAnimationFrame(this.update);
            }
        });
        this.renderer = new Renderer(config);
        this.physics = new PhysicsSystem();
        this.audio = new AudioManager();
        this.input = new InputManager();
        this.assetManager = new AssetManager();
        this.rootEntity = new Entity('Root');
        this.setupInputListeners();
    }
    setupInputListeners() {
        // Input events can be hooked into here
        this.input.on('keydown', (event) => {
            this.emit('input:keydown', event);
        });
    }
    /**
     * Get access to subsystems
     */
    getRenderer() {
        return this.renderer;
    }
    getPhysics() {
        return this.physics;
    }
    getAudio() {
        return this.audio;
    }
    getInput() {
        return this.input;
    }
    getAssetManager() {
        return this.assetManager;
    }
    getRootEntity() {
        return this.rootEntity;
    }
    /**
     * Create and register a new entity
     */
    createEntity(name = 'Entity') {
        const entity = new Entity(name);
        this.rootEntity.addChild(entity);
        this.physics.addEntity(entity);
        return entity;
    }
    /**
     * Start the engine update loop
     */
    start() {
        if (this.isRunning)
            return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.emit('engine:start');
        this.update();
    }
    /**
     * Stop the engine update loop
     */
    stop() {
        if (!this.isRunning)
            return;
        this.isRunning = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.emit('engine:stop');
    }
    /**
     * Get current frame time info
     */
    getDelta() {
        return {
            deltaTime: this.deltaTime,
            elapsedTime: this.elapsedTime
        };
    }
    /**
     * Clean up engine resources
     */
    dispose() {
        this.stop();
        this.rootEntity.dispose();
        this.renderer.dispose();
        this.physics.dispose();
        this.audio.dispose();
        this.input.dispose();
        this.assetManager.dispose();
        this.clear();
    }
}
//# sourceMappingURL=Engine.js.map