// 프로그래밍에서 모나드가 갖춰야 하는 조건
// 1. 타입을 인자로 받는 타입(특정 타입의 값을 포장) - 제네릭을 통해 구현
// 2. 특정 타입의 값을 포장한 것을 반환하는 함수(메서드)가 존재
// 3. 포장된 값을 변환하여 같은 형태로 포장하는 함수(메서드)가 존재

// 모나드를 이해하는 출발점은 값을 어딘가에 포장하는 개념을 이해햐는 것에서 출발한다.
// 모나드를 사용한 예 중 하나가 바로 옵셔널(값이 있을지 없을지 모르는 상태를 포장)

// 컨텍스트
// 옵셔널은 열거형으로 구현되어 있다.
// 값이 없다면 열거형의 .none으로 있다면 .some(value) case로 값을 지니게 된다.
// 옵셔널의 값을 추출한다는 것은 .some(value) case의 연관값을 꺼내오는 것과 같다.
// 옵셔널은 Wrapped 타입을 인자로 받는 제네릭 타입이다.
func addThree(_ num: Int) -> Int {
    return num + 3
}
print(addThree(2)) // 5
// addThree(Optional(2)) // 오류발생

// 함수객체(Functor)
print(Optional(2).map(addThree) as Any)

var value: Int? = 2
print(value.map{ $0 + 3 } as Any)
value = nil
print(value.map{ $0 + 3 } as Any)
/*
    함수객체에서 맵 동작 모식도
    map(a->b)-> fa -> fb
    1. 맵이 함수를 인자로 받음
    2. 함수객체에 맵이 전달받은 함수를 적용
    3. 새로운 함수객체 반환

    extension Optional {
        func map<U>(f: (Wrapped) -> U) -> U? {
            switch self {
                case .some(let x): return f(x)
                case .none: return .none
            }
        }
    }
    옵셔널의 map 메서드를 호출하면 옵셔널 스스로 값이 있는지 없는지 switch 구문으로 판단한다.
    값이 있다면 전달받은 함수에 자신의 값을 적용한 결과값을 다시 컨텍스트에 넣어 반환하고,
    그렇지 않다면 함수를 실행하지 않고 빈 컨텍스트를 반환한다.
*/

// 모나드
// 함수 객체 중 자신의 컨텍스트와 같은 컨텍스트의 형태로 맵핑할 수 있는 함수객체를 닫힌 함수객체(Endofunctor)라고 한다. 모나드는 닫힌 함수객체다.
// 함수 객체는 포장된 값을 함수에 적용할 수 있었다. 모나드도 컨텍스트에 포장된 값을 처리하여 포장된 값을 컨텍스트에 다시 반환하는 함수를 적용할 수 있다.
// ==> 플랫맵(flatMap)
func doubledEven(_ num: Int) -> Int? {
    if num.isMultiple(of: 2) {
        return num * 2
    }
    return nil
}

print(Optional(3).flatMap(doubledEven) as Any) // nil

// 플랫맵은 맵과 다르게 컨텍스트 내부의 컨텍스트를 모두 같은 위상으로 평평하게 펼쳐준다.
// 즉, 포장된 값 내부의 포장된 값의 포장을 풀어서 같은 위상으로 펼쳐준다.

// flatMap(_:) 메서드를 Sequence 타입이 Optional 타입의 Element를 가지고 있는 경우에는 compactMap(_:)이라는 이름으로 사용한다.
let optionals: [Int?] = [1, 2, nil, 5]
let mapped: [Int?] = optionals.map{$0}
let compactMapped: [Int] = optionals.compactMap{$0}

print(mapped) // [Optional(1), Optional(2), nil, Optional(5)]
print(compactMapped) // [1, 2, 5]

let multipleContainer = [[1, 2, Optional.none], [3, Optional.none], [4, 5, Optional.none]]
let mappedMultipleContainer = multipleContainer.map{ $0.map{ $0 } }
let flatmappedMultipleContainer = multipleContainer.flatMap{ $0.compactMap{ $0 } }

print(mappedMultipleContainer) // [[Optional(1), Optional(2), nil], [Optional(3), nil], [Optional(4), Optional(5), nil]]
print(flatmappedMultipleContainer) // [1, 2, 3, 4, 5]

func stringToInteger(_ string: String) -> Int? {
    return Int(string)
}

func integerToString(_ integer: Int) -> String? {
    return "\(integer)"
}

var optionalString: String? = "2"

let flattenResult = optionalString.flatMap(stringToInteger).flatMap(integerToString).flatMap(stringToInteger)
print(flattenResult as Any) // Optional(2)

/*
    옵셔널의 맵과 플랫맵의 정의

    func map<U>(_ transform: (Wrapped) throws -> U) rethrows -> U?
    func flatMap<U>(_ transform: (Wrapped) throws -> U?) rethrows -> U?

    맵에서 전달받는 함수 transform은 포장된 값을 매개변수로 갖고 U를 반환하는 함수다.
    예를 들어, 위 코드에서 stringToInt(_:)는 String 타입을 전달받고 Int? 타입을 반환한다.
    이 함수를 map에 주면 U가 Int?가 되므로 최종 반환 타입은 Int??가 된다. 즉, 옵셔널을 감싼 옵셔널이 된다.

    반면, flatMap에 stringToInt(_:)를 주면 U?가 Int?가 되므로 최종반환타입은 Int?가 된다.

    플랫맵을 사용하지 않으면서 플랫맵과 같은 효과를 얻으려면 아래와 같이 바인딩을 직접 해야 한다.
*/
var result: Int?
if let string: String = optionalString {
    if let number: Int = stringToInteger(string) {
        if let finalString: String = integerToString(number) {
            if let finalNumber: Int = stringToInteger(finalString) {
                result = Optional(finalNumber)
            }
        }
    }
}

print(result as Any)

if let string: String = optionalString,
    let number: Int = stringToInteger(string),
    let finalString: String = integerToString(number),
    let finalNumber: Int = stringToInteger(finalString) {
    result = Optional(finalNumber)
}

print(result as Any)

// 플랫맵은 체이닝 중간에 연산에 실패하는 경우나 값이 없어지는 경우에는 별도의 예외 처리없이 빈 컨테이너를 반환한다.
func integerToNil(param: Int) -> String? {
    return nil
}

optionalString = "2"
result = optionalString.flatMap(stringToInteger)
    .flatMap(integerToNil) //  이 부분에서 nil(Optional.none)을 반환받기 때문에 이후에 호출되는 메서드는 무시한다. 바로, 옵셔널이 모나드이기때문에 가능한 것.
    .flatMap(stringToInteger)
print(result as Any)