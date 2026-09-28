import { GameManager } from './game/GameManager'
import { WebGLDetect } from './utils/WebGLDetect'
import { FPSMeter } from './utils/FPSMeter'
import { PointerLock } from './utils/PointerLock'

// Wait for DOM to be ready
window.addEventListener('DOMContentLoaded', async () => {
  const loadingEl = document.getElementById('loading')
  const chunksEl = document.getElementById('chunks')

  try {
    // Check WebGL support (but allow Canvas 2D fallback)
    console.log('Checking WebGL support...')
    WebGLDetect.diagnose()

    if (!WebGLDetect.hasWebGL()) {
      console.warn('⚠️ WebGL not available - using Canvas 2D fallback')
      console.warn('Enable hardware acceleration in browser settings for better performance')
    } else {
      console.log('✅ WebGL detected')
    }

    console.log('Initializing game...')

    // Initialize game
    const game = new GameManager()

    // Initialize FPS mode with tile-based world
    await game.initializeFPS()

    console.log('✅ Game initialized, starting...')

    // Debug: Log scene info
    const scene = game.getScene()
    const renderer = game.getEngine().getRenderer()
    console.log('Scene:', scene.getScene())
    console.log('Renderer WebGL available:', (renderer as any).isWebGLAvailable?.())
    console.log('Camera:', renderer.getCamera())

    // Start the game
    game.start()

    console.log('🎮 Game loop started')

    // Hide loading screen
    if (loadingEl) {
      loadingEl.classList.add('hidden')
    }

    // Debug: Check if chunks are loading
    setTimeout(() => {
      const streamer = game.getStreamer()
      if (streamer) {
        const info = streamer.getDebugInfo()
        console.log('Chunk status:', info)
      }
    }, 2000)

    // Start pointer lock
    const pointerLock = new PointerLock()

    // Start FPS meter
    const fpsMeter = new FPSMeter()

    // Debug: Show player position and input
    const input = game.getEngine().getInput()
    let debugCounter = 0

    setInterval(() => {
      debugCounter++

      const w = input.isKeyPressed('w')
      const a = input.isKeyPressed('a')
      const s = input.isKeyPressed('s')
      const d = input.isKeyPressed('d')

      if (w || a || s || d) {
        const player = scene.getPlayer()
        const pos = player.getTransform().position
        const rot = player.getTransform().rotation

        console.log(`[${debugCounter}] Moving - W:${w} A:${a} S:${s} D:${d}`)
        console.log(`  Player pos: (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})`)
        console.log(`  Player rot: (${rot.x.toFixed(3)}, ${rot.y.toFixed(3)}, ${rot.z.toFixed(3)}, ${rot.w.toFixed(3)})`)
      }

      // Update FPS meter
      fpsMeter.update()
    }, 500)

    // Update chunk info every frame
    if (chunksEl && game.getStreamer()) {
      setInterval(() => {
        const streamer = game.getStreamer()
        if (streamer) {
          const info = streamer.getDebugInfo()
          chunksEl.textContent = `Chunks: ${info.loadedChunks}/${info.visibleChunks} visible`
        }
      }, 500)
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      pointerLock.dispose()
      fpsMeter.dispose()
      game.dispose()
    })
  } catch (error) {
    console.error('❌ Failed to initialize game:', error)
    const message = error instanceof Error ? error.message : String(error)
    if (loadingEl) {
      loadingEl.innerHTML = `
        <p style="color: #ff6b6b; font-weight: bold;">❌ Error</p>
        <p>${message}</p>
        <p style="font-size: 11px; margin-top: 10px; color: #999;">Check browser console for details</p>
      `
    }
  }
})

