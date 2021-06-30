import { clearTimeout } from 'timers';

export interface options<T> {
    ttl?: number;
    onDelete?: OnDelete<T>
}

type OnDelete<T> = (value: T) => void;
function noop() { }

export default class LocalCache<T> {
    private dataMap: Map<string, T>;
    private timeoutMap: Map<string, NodeJS.Timeout>;
    private ttl: number;
    private onDelete: OnDelete<T>;

    /**
     * Deletion with ttl is asynchronous. 
     * 
     * @param config.ttl time in milisecond. Default -1
     * @param config.onDelete  triggered when deletion. Default empty function
     */
    constructor(config?: options<T>) {
        this.dataMap = new Map();
        this.timeoutMap = new Map();
        this.ttl = config?.ttl ?? -1;
        this.onDelete = config?.onDelete ?? noop;
    }

    /**
     * Add key value pair with ttl. Key will not deleted if ttl < 0. Options can be ttl or CacheConfiguration.
     * 
     * 
     * @param key string
     * @param value T
     * @param CacheConfiguration 
     */
    public set(key: string, value: T, options: options<T> | number = {}): void {
        this.deleteImmediately(key);
        this.dataMap.set(key, value);
        let ttl, onDelete;
        if (typeof options === 'number' && options !== undefined) {
            ttl = options;
            onDelete = this.onDelete;
        } else {
            ttl = options.ttl ?? this.ttl;
            onDelete = options.onDelete ?? this.onDelete;
        }

        if (ttl >= 0) this.deleteKeyAt(key, ttl, onDelete);
    }

    /**
     * Get data by key.
     * 
     * @param key 
     * @returns 
     */
    public get(key: string): T | undefined {
        return this.dataMap.get(key);
    }

    /**
     * Delete key immediately
     * 
     * @param key 
     */
    public delete(key: string): void {
        this.deleteImmediately(key);
    }

    /**
     * 
     * @returns {string[]} keys
     */
    public keys(): string[] {
        return [...this.dataMap.keys()];
    }

    public size(): number {
        return this.dataMap.size;
    }

    public clear(): void {
        this.dataMap.clear();
        this.timeoutMap.forEach(timeout => this.clearTimeout(timeout));
    }

    private deleteImmediately(key: string): void {
        if (this.dataMap.delete(key)) {
            this.clearTimeout(this.timeoutMap.get(key));
            this.timeoutMap.delete(key);
        }
    }

    private clearTimeout(timeout?: NodeJS.Timeout): void {
        if (timeout !== undefined) {
            clearTimeout(timeout);
        }
    }

    /**
     * 
     * @param key 
     * @param ttl 
     * @param onDelete 
     */
    private deleteKeyAt(key: string, ttl: number, onDelete: OnDelete<T>): void {
        const timeout = setTimeout(() => {
            const value = this.dataMap.get(key);
            if (value !== undefined) {
                this.deleteImmediately(key);
                onDelete(value);
            }
        }, ttl);

        this.timeoutMap.set(key, timeout);
    }
}
