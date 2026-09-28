/**
 * Core type definitions for the engine
 */

export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface Vec2 {
  x: number
  y: number
}

export interface Quaternion {
  x: number
  y: number
  z: number
  w: number
}

export interface Transform {
  position: Vec3
  rotation: Quaternion
  scale: Vec3
}

export interface EngineConfig {
  canvas?: HTMLCanvasElement
  width?: number
  height?: number
  antialias?: boolean
  enablePhysics?: boolean
  enableAudio?: boolean
}

export type UpdateDelta = {
  deltaTime: number
  elapsedTime: number
}
