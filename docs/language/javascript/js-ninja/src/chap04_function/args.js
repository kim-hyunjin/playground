function smallest(array) {
    return Math.min.apply(Math, array);
}

function largest(array) {
    return Math.max.apply(Math, array);
}

function merge(root) {
    for (let i = 1; i < arguments.length; i++) {
        for (let key in arguments[i]) {
            root[key] = arguments[i][key];
        }
    }
    return root;
}

const merged = merge({name: "hyunjin"}, {age: 29});
console.log(merged.name);
console.log(merged.age);

function multiMax(multi) {
    console.log(arguments)
    return multi * Math.max.apply(Math, Array.prototype.slice.call(arguments, 1));
}

console.log(multiMax(3, 1, 2, 3) == 9);