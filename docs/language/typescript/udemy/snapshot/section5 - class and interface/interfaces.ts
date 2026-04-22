// interface는 타입스크립트에만 있음
interface Named {
    readonly name: string;
    outputName?: string; // optional
}

interface Greetable extends Named {
    greet(phrase: string): void;
}

interface Runnable {
    run(): void;
}

class Person implements Greetable, Runnable {
    constructor(public name: string, public age: number) {}

    greet(phrase: string): void {
        console.log(`${this.name}: ${phrase}`);
    }

    run(): void {
        console.log("run with two feet!");
    }
}

let user1: Greetable = new Person("Max", 30);

user1.greet("Hi there");
// user1.name = "somthing else"; // Error!

type AddFn = (a: number, b: number) => number;
/*
위 커스텀 타입 대신 아래 인터페이스를 사용할 수 있다.
일반적으로는 커스텀 타입을 사용한다.
interface AddFn {
    (a: number, b: number): number
}
*/

let add: AddFn;

add = (n1: number, n2: number) => {
    return n1 + n2;
};
