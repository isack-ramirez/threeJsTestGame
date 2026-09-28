import { EventEmitter } from '../core/EventEmitter'

/**
 * Input system - handles keyboard, mouse, and other input
 */
export class InputManager extends EventEmitter {
  private keysPressed: Map<string, boolean> = new Map()
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 }
  private mouseButtons: Map<number, boolean> = new Map()

  constructor() {
    super()
    this.setupKeyboardListeners()
    this.setupMouseListeners()
  }

  private setupKeyboardListeners(): void {
    window.addEventListener('keydown', (e) => this.onKeyDown(e))
    window.addEventListener('keyup', (e) => this.onKeyUp(e))

    // Debug: log first key press
    let firstKeyLogged = false
    const origKeyDown = this.onKeyDown.bind(this)
    this.onKeyDown = function(e: KeyboardEvent) {
      if (!firstKeyLogged) {
        console.log('🎮 First key detected:', e.key)
        firstKeyLogged = true
      }
      return origKeyDown(e)
    }

    console.log('✅ Keyboard listeners attached')
  }

  private setupMouseListeners(): void {
    window.addEventListener('mousemove', (e) => this.onMouseMove(e))
    window.addEventListener('mousedown', (e) => this.onMouseDown(e))
    window.addEventListener('mouseup', (e) => this.onMouseUp(e))
  }

  private onKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase()
    if (!this.keysPressed.has(key)) {
      this.emit('keydown', { key })
    }
    this.keysPressed.set(key, true)
  }

  private onKeyUp(event: KeyboardEvent): void {
    const key = event.key.toLowerCase()
    this.keysPressed.set(key, false)
    this.emit('keyup', { key })
  }

  private onMouseMove(event: MouseEvent): void {
    this.mousePosition.x = event.clientX
    this.mousePosition.y = event.clientY
    this.emit('mousemove', { x: event.clientX, y: event.clientY })
  }

  private onMouseDown(event: MouseEvent): void {
    this.mouseButtons.set(event.button, true)
    this.emit('mousedown', { button: event.button })
  }

  private onMouseUp(event: MouseEvent): void {
    this.mouseButtons.set(event.button, false)
    this.emit('mouseup', { button: event.button })
  }

  isKeyPressed(key: string): boolean {
    return this.keysPressed.get(key.toLowerCase()) ?? false
  }

  getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition }
  }

  isMouseButtonPressed(button: number): boolean {
    return this.mouseButtons.get(button) ?? false
  }

  dispose(): void {
    this.clear()
  }
}
