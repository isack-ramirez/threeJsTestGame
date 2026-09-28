/**
 * Simple event emitter for the engine
 */
type EventCallback = (...args: any[]) => void;
export declare class EventEmitter {
    private listeners;
    on(event: string, callback: EventCallback): void;
    off(event: string, callback: EventCallback): void;
    emit(event: string, ...args: any[]): void;
    once(event: string, callback: EventCallback): void;
    clear(): void;
}
export {};
//# sourceMappingURL=EventEmitter.d.ts.map