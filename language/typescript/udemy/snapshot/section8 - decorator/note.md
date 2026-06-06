# Decorators

https://www.typescriptlang.org/docs/handbook/decorators.html

## 정의

```
Decorators provide a way to add both annotations and a meta-programming syntax for class declarations and members.
(method, accessor, property, or parameter)
```

```
To enable experimental support for decorators, you must enable the experimentalDecorators compiler option either on the command line or in your tsconfig.json
```

```
Decorators use the form @expression, where expression must evaluate to a function that will be called at runtime with information about the decorated declaration.
```

## 실행순서

```javascript
function first() {
    console.log("first(): factory evaluated");
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("first(): called");
    };
}

function second() {
    console.log("second(): factory evaluated");
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("second(): called");
    };
}

class ExampleClass {
    @first()
    @second()
    method() {}
}
```

output:

```
first(): factory evaluated
second(): factory evaluated
second(): called
first(): called
```

### Decorator Evaluation

There is a well defined order to how decorators applied to various declarations inside of a class are applied:

1. Parameter Decorators, followed by Method, Accessor, or Property Decorators are applied for each instance member.
2. Parameter Decorators, followed by Method, Accessor, or Property Decorators are applied for each static member.
3. Parameter Decorators are applied for the constructor.
4. Class Decorators are applied for the class.

## Class Decorators

```
A Class Decorator is declared just before a class declaration. The class decorator is applied to the constructor of the class and can be used to observe, modify, or replace a class definition.
```

```
The expression for the class decorator will be called as a function at runtime, with the constructor of the decorated class as its only argument.
```

## Method Decorators

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

```
The decorator is applied to the Property Descriptor for the method, and can be used to observe, modify, or replace a method definition.
```

The expression for the method decorator will be called as a function at runtime, with the following three arguments:

1. Either the constructor function of the class for a static member, or the prototype of the class for an instance member.
2. The name of the member.
3. The Property Descriptor for the member.

```
If the method decorator returns a value, it will be used as the Property Descriptor for the method.
```

### 데코레이터를 사용한 클래스 validator

https://github.com/typestack/class-validator
