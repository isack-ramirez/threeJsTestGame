/**
 * Asset manager - handles loading and caching of game assets
 *
 * TODO: Add loaders for:
 * - Models (GLTF, OBJ, FBX)
 * - Textures (PNG, JPG, EXR)
 * - Audio (MP3, WAV, OGG)
 * - Other resources
 */
export declare class AssetManager {
    private assets;
    private loading;
    loadAsset<T>(name: string, url: string, loader?: (url: string) => Promise<T>): Promise<T>;
    private defaultLoader;
    getAsset<T>(name: string): T | undefined;
    hasAsset(name: string): boolean;
    unloadAsset(name: string): void;
    unloadAll(): void;
    dispose(): void;
}
//# sourceMappingURL=AssetManager.d.ts.map