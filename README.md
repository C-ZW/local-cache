# LocalCache

JS map wrapper with ttl and onDelete.

Zero dependency.

> npm i @c-zw/cache 

---

```ts
import LocalCache from '@c-zw/cache';

const cache = new LocalCache<number>({ // cache number data
    ttl: 1000, // default delete after 1 second
    onDelete: (value) => { // default onDelete action
        console.log(`Default onDelete: ${value}`);
    }
});
```

## set(key: string, value: T, options: options<T> | number = {}): void

```ts
cache.set('1', 111, {  // override default setting
    ttl: 2000, // delete after 2 seconds
    onDelete: (value) => console.log('delete ' + value)
})

cache.set('2', 222) // use default setting
cache.set('3', 333, 4000) // override default ttl only
```

## get(key: string): T | undefined

```ts
function printFirst() {
    setTimeout(() => {
        console.log(`get 1 data after 1999 milisecond: ${cache.get('1')}`);
    }, 1999);

    setTimeout(() => {
        console.log(`get 1 data after 2001 milisecond: ${cache.get('1')}`);
    }, 2001);
}

function printSecond() {
    setTimeout(() => {
        console.log(`get 2 data after 999 milisecond: ${cache.get('2')}`);
    }, 999);

    setTimeout(() => {
        console.log(`get 2 data after 1001 milisecond: ${cache.get('2')}`);
    }, 1001);
}

printFirst();
printSecond();

// get 2 data after 999 milisecond: 222
// Default onDelete: 222
// get 2 data after 1001 milisecond: undefined
// get 1 data after 1999 milisecond: 111
// delete: 111
// get 1 data after 2001 milisecond: undefined
```

## delete(key: string): void

will not trigger onDelete.


```ts
function printDelete() {
    cache.set('3', 333);
    cache.delete('3');
    console.log(`get 3 data after delete: ${cache.get('3')}`);
}

printDelete();

// get 3 data after delete: undefined
```

## keys(): string[]

```ts
function printKeys() {
    cache.set('4', 444);
    cache.set('5', 555);
    console.log(`get Keys: ${cache.keys()}`);
}

printKeys();

// get Keys: 1,2,4,5
```

## size(): number

return stored data size

## clear(): void

clear data and timeout