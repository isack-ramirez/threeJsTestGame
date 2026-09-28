/**
 * Dark Fantasy Game Engine
 * A modular 3D game engine built on Three.js
 */

export { Engine } from './Engine'

// Core
export { EventEmitter } from './core/EventEmitter'
export type { EngineConfig, UpdateDelta, Transform, Vec3, Vec2, Quaternion } from './core/types'

// Renderer
export { Renderer } from './renderer'
export type {} from './renderer'

// Physics
export { PhysicsSystem } from './physics'
export type {} from './physics'

// Audio
export { AudioManager } from './audio'
export type {} from './audio'

// Input
export { InputManager } from './input'
export type {} from './input'

// Entity
export { Entity, Component } from './entity'
export type {} from './entity'

// Assets
export { AssetManager } from './assetManager'
export type {} from './assetManager'
