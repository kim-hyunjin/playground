/*
    옵셔널은 안전성을 문법으로 담보하는 기능이다.
    값이 있을 수도 없을 수도 있음을 나타내는 표현이다. 즉, 변수 또는 상수의 값이 nil 일수도 있다는 것을 의미한다.
    전달인자의 값이 잘못된 경우 함수에서 제대로 처리하지 못했음을 표현하기 위해 nil을 반환할 수도 있고
    매개변수의타입을 옵셔널로 정의해 해당 매개변수를 꼭 넘기지 않아도 된다는 표현을 할 수 있다.
    더 놀라운 점은 옵셔널이 열거형으로 구현되어 있다는 점이다.
    ```
        public enum Optional<Wrapped>: ExpressibleByNilLiteral {
            case none
            case some(Wrapped)
            public init(_ some: Wrapped)
            // 중략...
        }
    ```
    옵셔널(Optional)은 제네릭이 적용된 열거형이다. ExpressibleByNilLiteral 프로토콜을 따른다.
    여기서 알아야할 것은 옵셔널이 값을 갖는 케이스와 그렇지 못한 케이스, 두 가지로 정의되어 있다는 것이다.
    즉, nil일 때는 none 케이스가 될 것이고, 값이 있는 경우 some의 연관값인 Wrapped에 값이 할당된다.

    옵셔널 자체가 열거형이기 때문에 옵셔널 변수는 switch 구문을 통해 값이 있고 없음을 확인할 수 있다.
*/
func checkOptionalValue(value optionalValue: Any?) {
    switch optionalValue {
        case .none:
            print("옵셔널 값: nil")
        case .some(let value):
            print("옵셔널 값: \(value)")
    }
}

var myName: String? = "hyunjin"
checkOptionalValue(value: myName)
myName = nil
checkOptionalValue(value: myName)

// where 절과 같이 쓰기
let numbers: [Int?] = [2, nil, -4, nil, 100]
for number in numbers {
    switch number {
        case .some(let value) where value < 0:
            print("음수! \(value)")
        case .some(let value) where value > 10:
            print("10보다 크다! \(value)")
        case .some(let value):
            print("값 \(value)")
        case .none:
            print("nil!")
    }
}

// 옵셔널 추출
// 강제 추출 - 가장 간단하지만 가장 위험한 방법 => 런타임 오류가 일어날 가능성이 가장 높다. 또 옵셔널을 만든 의미가 무색해지는 방법..
// 옵셔널이 아닌 변수에는 옵셔널 값이 들어갈 수 없으므로 추출해서 할당해주어야 한다.
// var hyunjin: String = myName! // 런타임 오류!

// 옵셔널 바인딩 - 옵셔널에 값이 있는지 확인할 때 사용한다.
if let name = myName { // if문안에서만 사용할 수 있는 임시 변수이다.
    print("My name is \(name)")
} else {
    print("myName == nil")
}

var yourName: String? = "jenny"
if let name = myName, let friend = yourName { // 하나라도 값이 없으면 실행되지 않는다.
    print("We are friend! \(name) & \(friend)")
}

myName = "hyunjin"
if let name = myName, let friend = yourName {
    print("We are friend! \(name) & \(friend)")
}

// 암시적 추출 옵셔널
// 지정된 타입은 일반 값처럼 사용할 수 있으나, 옵셔널이기 때문에 nil도 할당해 줄 수 있다.
// 마찬가지로 nil이 할당되어 있을 때 접근을 시도하면 런타임 오류가 발생한다.
var implicitlyUnwrappedOptional: String! = "hyunjin"
print(implicitlyUnwrappedOptional)
implicitlyUnwrappedOptional = nil
if let name = implicitlyUnwrappedOptional {
    print("My name is \(name)")
} else {
    print("implicitlyUnwrappedOptional == nil")
}

implicitlyUnwrappedOptional.isEmpty // 오류!!