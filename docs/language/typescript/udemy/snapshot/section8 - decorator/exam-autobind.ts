// PropertyDescriptor를 덮어쓸수있다.
function Autobind(
    _: any, // target
    _2: string, // methodName
    descriptor: PropertyDescriptor
): PropertyDescriptor {
    console.log(descriptor);
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        // configurable: true,
        // enumerable: false,
        get() {
            // getter안의 this는 getter가 속한 객체(여기서는 메소드를 원래 정의했던 객체)를 나타내므로 event lishtner에 의해 override되지 않는다.
            return originalMethod.bind(this);
        },
    };
    return adjDescriptor;
}

class Printer {
    message = "This is work!";

    @Autobind
    showMessage() {
        console.log(this.message);
    }
}

const printer = new Printer();
console.log(printer);
const button = document.querySelector("button")!;
// button.addEventListener("click", printer.showMessage.bind(printer));
button.addEventListener("click", printer.showMessage);
