function Log(target: any, propertyKey: string, descriptor?: PropertyDescriptor) {
    // 프로퍼티는 descriptor가 없다.
    console.log("Members Decorator!");
    console.log(target, propertyKey, descriptor);
}

// 마지막 argument자리에는 파라미터 변수의 위치가 넘어온다.
function ParamterLog(target: any, propertyKey: string, positon: number) {
    console.log("Parameter Decorator!");
    console.log(target, propertyKey, positon);
}

class Product {
    @Log
    title: string;
    private _price: number;
    get price() {
        return this._price;
    }
    @Log
    set price(p: number) {
        if (p > 0) {
            this._price = p;
        } else {
            throw new Error("Invalid price - should be bigger than 0");
        }
    }

    constructor(t: string, p: number) {
        this.title = t;
        this._price = p;
    }

    @Log
    getPriceWithTax(@ParamterLog tax: number) {
        return this._price - (1 - tax);
    }
}

/**
 * 메소드의 descriptor 설정을 변경할 수 있다.
 */
function enumerable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    };
}

class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }

    @enumerable(false)
    greet() {
        return "Hello, " + this.greeting;
    }
}
