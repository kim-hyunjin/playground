// 클래스 데코레이터의 유일한 argument는 생성자함수다.
function Logger(constructor: Function) {
    console.log("Logging...");
    console.log(constructor);
}

@Logger
class Person {
    name = "Max";

    constructor() {
        console.log("creating person object");
    }
}

// 클래스를 인스턴스화하는 것과 별개로 데코레이터는 동작한다.
// const pers = new Person();
// console.log(pers);

/**
 * 생성자 override
 */
function reportableClassDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
    console.log("생성자 override");
    // 생성자를 override하는 것이므로, 아래 동작은 클래스가 인스턴스화 될때 수행된다.
    return class extends constructor {
        reportingURL = "http://www...";
        constructor(...args: any[]) {
            super(args[0]);
            console.log(this.reportingURL);
        }
    };
}

@reportableClassDecorator
class BugReport {
    type = "report";
    title: string;

    constructor(t: string) {
        this.title = t;
    }
}

// 인스턴스화 될때 override한 생성자 실행
const bug = new BugReport("Needs dark mode");
console.log(bug); //{type: 'report', title: 'Needs dark mode', reportingURL: 'http://www...'}
console.log(bug.title); // Prints "Needs dark mode"
console.log(bug.type); // Prints "report"
// console.log(bug.reportingURL); // Property 'reportingURL' does not exist on type 'BugReport'.

// 데코레이터는 타입스크립트의 타입 자체를 바꾸지는 않는다.
// 따라서 생성자를 override할 때 추가한 새 속성 reportingURL을 타입스크립트는 알지 못한다.(BugReport 타입에는 reportingURL 프로퍼티가 없으므로)
