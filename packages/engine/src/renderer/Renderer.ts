import * as THREE from 'three'
import { EngineConfig, UpdateDelta } from '../core/types'
import { CanvasRenderer } from './CanvasRenderer'

/**
 * Renderer system - handles Three.js scene rendering with Canvas 2D fallback
 */
export class Renderer {
  private scene: THREE.Scene | null = null
  private camera: THREE.Camera | null = null
  private renderer: THREE.WebGLRenderer | null = null
  private canvasRenderer: CanvasRenderer | null = null
  private width: number
  private height: number
  private useWebGL: boolean = false

  constructor(config: EngineConfig) {
    this.width = config.width || window.innerWidth
    this.height = config.height || window.innerHeight

    // Try WebGL first
    try {
      this.initWebGL(config)
      this.useWebGL = true
      console.log('✅ WebGL Renderer initialized')
    } catch (error) {
      console.warn('⚠️ WebGL failed, using Canvas 2D fallback:', error)
      this.initCanvas(config)
      this.useWebGL = false
    }

    this.setupWindowResize()
  }

  private initWebGL(config: EngineConfig): void {
    // Scene setup
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x000000)

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      2000
    )
    // Camera will be positioned by CameraComponent, not here
    this.camera.position.set(0, 1.6, 5)

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: config.canvas,
      antialias: config.antialias ?? true,
      alpha: true,
      powerPreference: 'high-performance'
    })

    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap

    // Add to DOM if no canvas provided
    if (!config.canvas) {
      const canvas = this.renderer.domElement
      canvas.style.display = 'block'
      canvas.style.width = '100vw'
      canvas.style.height = '100vh'
      canvas.style.margin = '0'
      canvas.style.padding = '0'
      canvas.style.position = 'fixed'
      canvas.style.top = '0'
      canvas.style.left = '0'

      // Make sure we're appending to the right element
      const appEl = document.getElementById('app')
      if (appEl) {
        appEl.appendChild(canvas)
        console.log('✅ Canvas appended to #app')
      } else {
        document.body.appendChild(canvas)
        console.log('✅ Canvas appended to body')
      }
    }
  }

  private initCanvas(config: EngineConfig): void {
    // Fallback to Canvas 2D
    this.canvasRenderer = new CanvasRenderer(config)
  }

  private setupWindowResize(): void {
    window.addEventListener('resize', () => this.onWindowResize())
  }

  private onWindowResize(): void {
    this.width = window.innerWidth
    this.height = window.innerHeight

    if (this.useWebGL && this.renderer && this.camera) {
      if (this.camera instanceof THREE.PerspectiveCamera) {
        this.camera.aspect = this.width / this.height
        this.camera.updateProjectionMatrix()
      }
      this.renderer.setSize(this.width, this.height)
    }
  }

  getScene(): THREE.Scene {
    if (!this.scene) {
      throw new Error('Scene not available (WebGL failed)')
    }
    return this.scene
  }

  getCamera(): THREE.Camera {
    if (!this.camera) {
      throw new Error('Camera not available (WebGL failed)')
    }
    return this.camera
  }

  getThreeRenderer(): THREE.WebGLRenderer {
    if (!this.renderer) {
      throw new Error('Three.js renderer not available (WebGL failed)')
    }
    return this.renderer
  }

  isWebGLAvailable(): boolean {
    return this.useWebGL
  }

  render(delta: UpdateDelta): void {
    if (this.useWebGL && this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera)

      // Debug every 30 frames
      if (!('_renderCount' in this)) {
        ;(this as any)._renderCount = 0
      }
      ;(this as any)._renderCount++
      if ((this as any)._renderCount % 30 === 0) {
        console.log(`[RENDER] WebGL rendered - scene has ${this.scene.children.length} children`)
      }
    } else if (this.canvasRenderer) {
      this.canvasRenderer.render(delta)
    }
  }

  dispose(): void {
    if (this.renderer) {
      this.renderer.dispose()
    }
    if (this.canvasRenderer) {
      this.canvasRenderer.dispose()
    }
  }
}
