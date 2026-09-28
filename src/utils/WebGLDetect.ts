/**
 * WebGL detection and diagnostics
 */
export class WebGLDetect {
  static hasWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || (canvas.getContext('experimental-webgl') as any)
      return !!gl
    } catch (e) {
      return false
    }
  }

  static hasWebGL2(): boolean {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2')
      return !!gl
    } catch (e) {
      return false
    }
  }

  static getWebGLInfo(): Record<string, any> {
    const info: Record<string, any> = {
      webgl1: this.hasWebGL(),
      webgl2: this.hasWebGL2()
    }

    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')

      if (gl) {
        info.vendor = gl.getParameter(gl.VENDOR)
        info.renderer = gl.getParameter(gl.RENDERER)
        info.version = gl.getParameter(gl.VERSION)
        info.shadingLanguageVersion = gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
      }
    } catch (e) {
      info.error = String(e)
    }

    return info
  }

  static diagnose(): void {
    console.log('=== WebGL Diagnostics ===')
    const info = this.getWebGLInfo()
    console.log('WebGL 1.0 Support:', info.webgl1)
    console.log('WebGL 2.0 Support:', info.webgl2)
    if (info.vendor) console.log('Vendor:', info.vendor)
    if (info.renderer) console.log('Renderer:', info.renderer)
    if (info.version) console.log('Version:', info.version)
    if (info.error) console.log('Error:', info.error)
  }
}
