/**
 * Asset manager - handles loading and caching of game assets
 *
 * TODO: Add loaders for:
 * - Models (GLTF, OBJ, FBX)
 * - Textures (PNG, JPG, EXR)
 * - Audio (MP3, WAV, OGG)
 * - Other resources
 */
export class AssetManager {
  private assets: Map<string, any> = new Map()
  private loading: Map<string, Promise<any>> = new Map()

  async loadAsset<T>(name: string, url: string, loader?: (url: string) => Promise<T>): Promise<T> {
    // Check if already loaded
    if (this.assets.has(name)) {
      return this.assets.get(name) as T
    }

    // Check if currently loading
    if (this.loading.has(name)) {
      return this.loading.get(name) as Promise<T>
    }

    // Load the asset
    const promise = new Promise<T>(async (resolve, reject) => {
      try {
        let asset: T
        if (loader) {
          asset = await loader(url)
        } else {
          asset = await this.defaultLoader(url) as T
        }
        this.assets.set(name, asset)
        resolve(asset)
      } catch (error) {
        reject(error)
      }
    })

    this.loading.set(name, promise)
    return promise
  }

  private async defaultLoader(url: string): Promise<any> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to load asset: ${url}`)
    }
    return response.json()
  }

  getAsset<T>(name: string): T | undefined {
    return this.assets.get(name) as T | undefined
  }

  hasAsset(name: string): boolean {
    return this.assets.has(name)
  }

  unloadAsset(name: string): void {
    this.assets.delete(name)
  }

  unloadAll(): void {
    this.assets.clear()
    this.loading.clear()
  }

  dispose(): void {
    this.unloadAll()
  }
}
