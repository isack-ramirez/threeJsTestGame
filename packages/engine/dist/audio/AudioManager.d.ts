import { EventEmitter } from '../core/EventEmitter';
/**
 * Audio system - handles sound effects and music
 *
 * TODO: Implement audio playback using Web Audio API or audio library
 */
export declare class AudioManager extends EventEmitter {
    private audioContext;
    private sounds;
    private isEnabled;
    constructor();
    private initializeAudioContext;
    getAudioContext(): AudioContext | null;
    loadSound(_name: string, _url: string): Promise<void>;
    playSound(name: string, options?: {
        volume?: number;
        loop?: boolean;
    }): void;
    stopSound(name: string): void;
    setVolume(_volume: number): void;
    setEnabled(enabled: boolean): void;
    isAudioEnabled(): boolean;
    dispose(): void;
}
//# sourceMappingURL=AudioManager.d.ts.map