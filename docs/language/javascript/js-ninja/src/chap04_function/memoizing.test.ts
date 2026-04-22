import {Ninja, store} from './memoizing'

describe('memoizing test', () => {
    it('add duplicate fn to cache', () => {
        let ninja: Ninja = {
            id: 0,
            fn: ()=>{}
        }
        expect(store.add(ninja)).toBe(true);
        expect(store.add(ninja)).toBe(false);
    })
})