/**
 * Pointer lock manager for FPS mouse control
 */
export class PointerLock {
  private isLocked: boolean = false
  private canvas: HTMLCanvasElement | null = null

  constructor(canvas?: HTMLCanvasElement) {
    this.canvas = canvas || (document.querySelector('canvas') as HTMLCanvasElement)
    if (!this.canvas) {
      console.warn('⚠️ No canvas found for pointer lock')
      return
    }

    this.setupListeners()
    console.log('✅ Pointer lock initialized. Click canvas to lock mouse, press ESC to unlock')
  }

  private setupListeners(): void {
    if (!this.canvas) return

    // Lock on click
    this.canvas.addEventListener('click', () => {
      if (!this.isLocked) {
        this.lock()
      }
    })

    // Unlock on ESC
    document.addEventListener('pointerlockchange', () => {
      this.isLocked = !!(document.pointerLockElement === this.canvas)
      console.log(this.isLocked ? '🔒 Pointer locked' : '🔓 Pointer unlocked')
    })

    document.addEventListener('pointerlockerror', () => {
      console.error('❌ Pointer lock error')
    })
  }

  private lock(): void {
    if (!this.canvas) return
    this.canvas.requestPointerLock =
      this.canvas.requestPointerLock || (this.canvas as any).mozRequestPointerLock
    this.canvas.requestPointerLock()
  }

  isPointerLocked(): boolean {
    return this.isLocked
  }

  dispose(): void {
    if (this.isLocked) {
      document.exitPointerLock?.()
    }
  }
}
