import LocalCache from "..";

const cache = new LocalCache<number>({ // cache number data
    ttl: 1000, // default delete after 1 second
    onDelete: (value) => { // default onDelete action
        console.log(`Default onDelete: ${value}`);
    }
});

cache.set('1', 111, {  // override default setting
    ttl: 2000, // delete after 2 seconds
    onDelete: (value) => console.log(`delete: ${value}`)
})

cache.set('2', 222) // use default setting



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

function printDelete() {
    cache.set('3', 333);
    cache.delete('3');
    console.log(`get 3 data after delete: ${cache.get('3')}`);
}

printDelete();

function printKeys() {
    cache.set('4', 444);
    cache.set('5', 555);
    console.log(`get keys: ${cache.keys()}`);
    console.log(`get size: ${cache.size()}`);
}

printKeys();