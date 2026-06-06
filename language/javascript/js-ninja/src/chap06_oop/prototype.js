function Ninja() {
    this.swung = false;
    this.swingSword = function() {
        return !this.swung;
    };
}

Ninja.prototype.swingSword = function() {
    return this.swung;
}

var ninja1 = Ninja();

console.log(ninja1 == undefined);

var ninja2 = new Ninja();
console.log(ninja2 && ninja2.swingSword && ninja2.swingSword());
// 초기화 수행 순서
// 1. 프로토타입의 프로퍼티들이 새로 만들어진 객체 인스턴스와 비인딩된다.
// 2. 생성자 함수 내에서 정의한 프로퍼티들이 객체 인스턴스에 추가된다.
// ==> 생성자 내에서 수행하는 바인딩은 항상 프로토타입의 바인딩보다 우선한다.
// 생성자 내에서 this 콘텍스트는 인스턴스 자신을 참조한다. -> this 값을 사용하여 생성자 내에서 마음껏 초기화 작업을 할 수 있다.


// 프로토타입의 프로퍼티들은 어디에도 복사되지 않고, 생성된 객체에 프로토타입이 덧붙는다.
// ==> 객체의 어떤 프로퍼티를 참조할 때 해당 객체가 직접 소유한게 아니라면 프로토타입에서 찾는다.
Ninja.prototype.jump = function() {
    console.log("jump!");
}

ninja2.jump();

/*
    정리
    1. 객체의 프로퍼티를 참조하면, 객체는 자신에게 해당 프로퍼티가 존재하는지 검사한다.
    2. 없다면, 프로토타입에 해당 프로퍼티가 있는지 검사한다.
    3. 그래도 없다면 undefined.
*/
// 자바스크립트의 모든 객체는 암묵적으로 constructor라는 프로퍼티를 갖고 있으며, 이 프로퍼티는 객체를 만드는데 사용한 생성자를 참조한다.
// 그리고 프로토타입은 생성자의 프로퍼티이기 때문에 모든 객체는 자신의 프로토타입을 찾을 수 있다.
console.log(ninja2.constructor);
console.log(ninja2.swingSword);
console.log(ninja2.constructor.prototype.swingSword);
console.log(ninja2.constructor.prototype.jump);

console.log(typeof ninja2 == "object");
console.log(ninja2 instanceof Ninja);
console.log(ninja2.constructor == Ninja);

// constructor 프로퍼티는 역으로 원본 생성자를 참조하기 때문에, 이를 이용해 새 객체 인스턴스를 만들 수 있다.
var ninja3 = new ninja2.constructor();
console.log(ninja3 instanceof Ninja);
console.log(ninja2 !== ninja3);

// 상속과 프로토타입 체인
function Person() {}
Person.prototype.dance = function() {};

Ninja.prototype = {dance: Person.prototype.dance};
var ninja4 = new Ninja();
console.log("ninja4 instanceof Ninja", ninja4 instanceof Ninja);
console.log("ninja4 instanceof Person", ninja4 instanceof Person); // false
console.log("ninja4 instanceof Object", ninja4 instanceof Object);

Ninja.prototype = new Person();
var ninja4 = new Ninja();
console.log("ninja4 instanceof Ninja", ninja4 instanceof Ninja);
console.log("ninja4 instanceof Person", ninja4 instanceof Person); // true
console.log("ninja4 instanceof Object", ninja4 instanceof Object);