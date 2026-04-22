namespace App {
    export function Autobind(
        _: any, // target
        _2: string, // methodName
        descriptor: PropertyDescriptor
    ): PropertyDescriptor {
        const originalMethod = descriptor.value;
        const adjDescriptor: PropertyDescriptor = {
            configurable: true,
            get() {
                return originalMethod.bind(this);
            },
        };
        return adjDescriptor;
    }
}
