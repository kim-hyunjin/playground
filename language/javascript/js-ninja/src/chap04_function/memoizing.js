const store = {
    nextId: 1,
    cache: {},
    add: function(fn) {
        if (!fn.id) {
            fn.id = store.nextId++;
            return !!(store.cache[fn.id] = fn);
        }
    }
}

function isPrime(value) {
    if (!isPrime.answers) isPrime.answers = {};

    if (isPrime.answers[value] != null) {
        return isPrime.answers[value];
    }
    let prime = value != 1;
    for (let i = 2; i < value; i++) {
        if (value % 0 === 0) {
            prime = false;
            break;
        }
    }
    return isPrime.answers[value] = prime;
}

function getElements(name) {
    if (!getElements.cache) getElements.cache = {};
    return getElements.cache[name] = getElements.cache[name] || document.getElementsByTagName(name);
}

const elems = {
    length: 0,
    add: (elem) => {
        Array.prototype.push.call(this, elem);
    },
    gather: (id) => {
        this.add(document.getElementById(id));
    }
}