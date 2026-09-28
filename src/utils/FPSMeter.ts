/**
 * FPS meter for performance debugging
 */
export class FPSMeter {
  private frameCount: number = 0
  private lastTime: number = performance.now()
  private fps: number = 0
  private element: HTMLElement | null = null

  constructor() {
    this.createElement()
  }

  private createElement(): void {
    this.element = document.createElement('div')
    this.element.id = 'fps-meter'
    this.element.style.position = 'fixed'
    this.element.style.top = '80px'
    this.element.style.left = '10px'
    this.element.style.background = 'rgba(0, 0, 0, 0.8)'
    this.element.style.color = '#4ecdc4'
    this.element.style.padding = '10px'
    this.element.style.fontFamily = 'monospace'
    this.element.style.fontSize = '12px'
    this.element.style.zIndex = '200'
    this.element.style.borderRadius = '3px'
    this.element.style.lineHeight = '1.4'
    document.body.appendChild(this.element)
  }

  update(): void {
    this.frameCount++
    const now = performance.now()
    const delta = now - this.lastTime

    if (delta >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / delta)
      this.frameCount = 0
      this.lastTime = now

      if (this.element) {
        this.element.innerHTML = `FPS: ${this.fps}`
      }
    }
  }

  dispose(): void {
    if (this.element) {
      this.element.remove()
    }
  }
}
