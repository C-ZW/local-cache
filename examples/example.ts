
import LocalCache from "..";

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