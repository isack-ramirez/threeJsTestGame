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
    constructor() {
        Object.defineProperty(this, "assets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "loading", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    async loadAsset(name, url, loader) {
        // Check if already loaded
        if (this.assets.has(name)) {
            return this.assets.get(name);
        }
        // Check if currently loading
        if (this.loading.has(name)) {
            return this.loading.get(name);
        }
        // Load the asset
        const promise = new Promise(async (resolve, reject) => {
            try {
                let asset;
                if (loader) {
                    asset = await loader(url);
                }
                else {
                    asset = await this.defaultLoader(url);
                }
                this.assets.set(name, asset);
                resolve(asset);
            }
            catch (error) {
                reject(error);
            }
        });
        this.loading.set(name, promise);
        return promise;
    }
    async defaultLoader(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load asset: ${url}`);
        }
        return response.json();
    }
    getAsset(name) {
        return this.assets.get(name);
    }
    hasAsset(name) {
        return this.assets.has(name);
    }
    unloadAsset(name) {
        this.assets.delete(name);
    }
    unloadAll() {
        this.assets.clear();
        this.loading.clear();
    }
    dispose() {
        this.unloadAll();
    }
}
//# sourceMappingURL=AssetManager.js.map