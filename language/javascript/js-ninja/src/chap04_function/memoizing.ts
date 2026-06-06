 /*
    함수가 프로퍼티를 가질 수 있음으로써 얻는 장점1

    메모이제이션

    장점
    사용자는 이전에 연산된 값을 요청할 때 성능 향상을 얻을 수 있다.
    사용자 또는 개발자가 메모이제이션이 동작하도록 하기 위해서 별도의 작업을 할 필요가 없다.

    단점
    유형에 상관없이 캐싱을 하게 되면 성능이 향상되는 대신 메모리 사용량이 늘어난다.
    캐싱이 비즈니스 로직과 혼재된다.
    메모이징을 적용하게 되면 부하 테스트나 알고리즘 자체의 성능 테스트가 어려워진다.
 */
 
 interface Ninja {
    id: number;
    fn: () => void;
 }

const store = {
    nextId: 1,
    cache: new Map(),
    add: (ninja: Ninja): boolean => {
        if (!ninja.id) {
            ninja.id = store.nextId++;
            return !!(store.cache.set(ninja.id, ninja.fn));
        }
        return false
    }
};

interface F {
    (value:number): boolean
    answers: Map<number, boolean>
}

const isPrime = <F>function (value) {
    if (!isPrime.answers) isPrime.answers = new Map<number, boolean>();

    if (isPrime.answers.get(value) != null) {
        return isPrime.answers.get(value);
    }

    let prime = value != 1;
    for (let i = 2; i < value; i++) {
        if (value % i == 0) {
            prime = false;
            break;
        }
    }
    isPrime.answers.set(value, prime);
    return prime;
}

interface getElementsFn {
    (name:string): HTMLCollectionOf<Element>
    cache: Map<string, HTMLCollectionOf<Element>>
}

const getElements = <getElementsFn>function (name) {
    if (!getElements.cache) getElements.cache = new Map<string, HTMLCollectionOf<Element>>();
    if (!getElements.cache.get(name)) {
        getElements.cache.set(name, document.getElementsByTagName(name))
    }
    return getElements.cache.get(name)
}


export {Ninja, store}