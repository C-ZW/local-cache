import LocalCache from '..';
import { expect } from 'chai';

const ttl = 10;

describe('test', () => {
    const cache = new LocalCache<number>({
        ttl,
        onDelete: (value) => { }
    });

    it('check set and get with default configuration', (done) => {
        expect(cache.set('1', 1), 'set').to.be.undefined;
        expect(cache.get('1'), 'get').to.equal(1);

        setTimeout(() => {
            expect(cache.get('1')).to.be.undefined;
            done();
        }, ttl + 1);
    })

    it('check override default ttl', (done) => {
        cache.set('2', 2, {
            ttl: ttl + 2
        });

        setTimeout(() => {
            expect(cache.get('2'), 'get 2 value').to.equal(2);
            done();
        }, ttl + 1);
    })

    it('check override default onDelete', (done) => {
        let onDeleteValue = 0;
        cache.set('3', 3, {
            onDelete: (value) => onDeleteValue = value
        });

        setTimeout(() => {
            expect(onDeleteValue).to.equal(3);
            done();
        }, ttl + 1);
    })

    it('check size', () => {
        const cache = new LocalCache<number>({
            ttl,
            onDelete: (value) => { }
        });
        expect(cache.size()).to.equal(0);
        cache.set('1', 1);
        expect(cache.size()).to.equal(1);
    })

    it('check clear', () => {
        const cache = new LocalCache<number>({
            ttl,
            onDelete: (value) => { }
        });
        cache.set('1', 1);
        cache.clear();

        expect(cache.size()).to.equal(0);
        expect(cache.get('1')).to.be.undefined;
    })

    it('check delete', () => {
        const cache = new LocalCache<number>({
            ttl,
            onDelete: (value) => { }
        });
        cache.set('1', 1);
        cache.delete('1');

        expect(cache.size()).to.equal(0);
        expect(cache.get('1')).to.be.undefined;
    })

    it('check keys', () => {
        const cache = new LocalCache<number>({
            ttl,
            onDelete: (value) => { }
        });
        cache.set('1', 1);
        cache.set('2', 2);
        expect(cache.keys()).to.have.all.members(['1', '2']);
        cache.set('1', 1);
        expect(cache.keys()).to.have.all.members(['1', '2']);

    })
})
