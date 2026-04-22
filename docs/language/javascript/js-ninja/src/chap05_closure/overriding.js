Function.prototype.memoized = function(key) {
    this._values = this._values || {}; // 함수의 반환값을 저장하는 캐시역할
    return this._values[key] !== undefined ? this._values[key] : this._values[key] = this.apply(this, arguments); // 캐시에 없을 경우 원래 함수를 호출하고 반환값을 저장해둔다.
};

Function.prototype.memoize = function() {
    var fn = this; // 함수의 콘텍스트를 '변수에 저장'해서, 클로저 안으로 가져온다. this는 클로저의 일부가 될 수 없기 때문에 이렇게 하지 않으면 콘텍스트는 사라지게 된다.
    return function() {
        return fn.memoized.apply(fn, arguments); // 원래 함수를 메모이제이션 함수로 감싼다.
    }
}

// 클로저를 이용해 원본 함수를 숨김
// => 개발에 유용하게 사용할 수 있지만, 너무 많은 코드를 숨기게 되면 코드를 확장할 수 없게 된다. 이는 hook을 제공함으로써 해결할 수 있다.
var isPrime = (function isPrime(num) {
    var prime = num != 1;
    for (var i = 2; i < num; i++) {
        if (num % i == 0) {
            prime = false;
            break;
        }
    }
    return prime;
}).memoize();

console.log("5는 소수다.", isPrime(5));

// 함수 래핑
function wrap(object, method, wrapper) {
    var fn = object[method]; // 나중에 클로저를 통해 참조할 수 있도록 원본 함수 저장

    return object[method] = function() {
        return wrapper.apply(this, [fn.bind(this)].concat(Array.prototype.slice.call(arguments)));
    };
}