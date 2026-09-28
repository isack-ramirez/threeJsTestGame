/**
 * Game-specific type definitions
 */

export type CameraMode = 'firstperson' | 'thirdperson'

export interface CameraConfig {
  mode: CameraMode
  distance?: number // For third person
  height?: number // Eye height
  offset?: { x: number; y: number; z: number } // Camera offset from entity
}
