type Listener<T extends any[]> = (...args: T) => void;

export class EventEmitter<EventMap extends Record<string, any>> {
  private listeners: { [K in keyof EventMap]?: Listener<any>[] } = {};

  on<K extends keyof EventMap>(event: K, listener: EventMap[K]) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener as any);
  }

  off<K extends keyof EventMap>(event: K, listener: EventMap[K]) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter(l => l !== listener);
  }

  emit<K extends keyof EventMap>(event: K, ...args: Parameters<EventMap[K]>) {
    if (!this.listeners[event]) return;
    for (const listener of this.listeners[event]!) {
      listener(...args);
    }
  }
}
