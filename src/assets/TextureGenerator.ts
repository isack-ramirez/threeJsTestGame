import * as THREE from 'three'

/**
 * Generate dark fantasy textures procedurally
 */
export class TextureGenerator {
  /**
   * Generate a stone texture (for ground)
   */
  static generateStoneTexture(width: number = 512, height: number = 512): THREE.Texture {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!

    // Base dark gray
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, width, height)

    // Add random stone-like noise
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random()
      const variation = noise < 0.1 ? 30 : noise < 0.3 ? 15 : 0

      data[i] += variation // R
      data[i + 1] += variation // G
      data[i + 2] += variation // B
      // A stays 255
    }

    ctx.putImageData(imageData, 0, 0)

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    return texture
  }

  /**
   * Generate a dirt/earth texture
   */
  static generateDirtTexture(width: number = 512, height: number = 512): THREE.Texture {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!

    // Base brown
    ctx.fillStyle = '#2d1f0f'
    ctx.fillRect(0, 0, width, height)

    // Add organic noise pattern
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random()
      const variation = Math.floor(noise * 40)

      data[i] += variation // R (brown)
      data[i + 1] += Math.floor(variation * 0.7) // G (darker)
      data[i + 2] += Math.floor(variation * 0.4) // B (even darker)
    }

    ctx.putImageData(imageData, 0, 0)

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    return texture
  }

  /**
   * Generate a moss/grass texture
   */
  static generateMossTexture(width: number = 512, height: number = 512): THREE.Texture {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!

    // Base dark green
    ctx.fillStyle = '#1f3a1f'
    ctx.fillRect(0, 0, width, height)

    // Add moss spots and variation
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random()
      let variation = 0

      if (noise < 0.15) {
        // Light moss
        variation = 30
        data[i] += Math.floor(variation * 0.5) // R
        data[i + 1] += variation // G
        data[i + 2] += Math.floor(variation * 0.5) // B
      } else if (noise < 0.3) {
        // Dark spots
        variation = -20
        data[i] += variation
        data[i + 1] += variation
        data[i + 2] += variation
      }
    }

    ctx.putImageData(imageData, 0, 0)

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    return texture
  }

  /**
   * Generate a rock/basalt texture
   */
  static generateRockTexture(width: number = 512, height: number = 512): THREE.Texture {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!

    // Base dark gray/black
    ctx.fillStyle = '#0f0f1a'
    ctx.fillRect(0, 0, width, height)

    // Add rough basalt pattern
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random()
      const variation = Math.floor(noise * 25)

      data[i] += variation // R
      data[i + 1] += variation // G
      data[i + 2] += variation * 0.8 // B (slightly blue-ish)
    }

    ctx.putImageData(imageData, 0, 0)

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    return texture
  }

  /**
   * Generate a normal map for additional detail
   */
  static generateNormalMap(width: number = 512, height: number = 512): THREE.Texture {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!

    // Base normal (pointing up in Z)
    ctx.fillStyle = '#8080ff'
    ctx.fillRect(0, 0, width, height)

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    return texture
  }
}
