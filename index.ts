import { clearTimeout } from 'timers';

export interface CacheConfiguration<T> {
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
     * default ttl = -1
     * 
     * @constructor
     * @param config 
     */
    constructor(config?: CacheConfiguration<T>) {
        this.dataMap = new Map();
        this.timeoutMap = new Map();
        this.ttl = config?.ttl ?? -1;
        this.onDelete = config?.onDelete ?? noop;
    }

    /**
     * Add key value pair with ttl. Key will not deleted if ttl < 0.
     * 
     * @param key string
     * @param value T
     * @param ttl number
     */
    public set(key: string, value: T, options: CacheConfiguration<T> = {}): void {
        this.deleteImmediately(key);
        this.dataMap.set(key, value);

        const { ttl = this.ttl, onDelete = this.onDelete } = options;
        if (ttl >= 0) this.deleteKeyAt(key, ttl, onDelete);
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

const cache = new LocalCache<number>({
    ttl: 1000,
    onDelete: (value) => { console.log(`Default onDelete ${value}`) }
});


cache.set('1', 1000, {
    ttl: 1000,
    onDelete: (value) => console.log('delete ' + value)
})

cache.set('2', 2000, {
    ttl: 2000,
    onDelete: (value) => console.log('delete ' + value)
})


cache.set('3', 3000)

cache.set('1', 400)


async function test() {
    setTimeout(() => {
        console.log(cache.keys())
        cache.clear();
        console.log(cache.keys())

    }, 4000);


}
test()