// 스위프트의 나머지 연산
// 스위프트에서는 부동소수점 타입의 나머지 연산을 지원한다.
let number: Double = 5.0
var result: Double = number.truncatingRemainder(dividingBy: 1.5) // 0.5
result = 12.truncatingRemainder(dividingBy: 2.5)

var result2: Int = 5 / 3 // 1

/*
    비교 연산자
    값이 같다. A == B 
    참조가 같다. A === B
    패턴 매치 A ~= B
*/
// 스위프트의 유일한 참조 타입인 클래스의 인스턴스에서만 참조 비교 연산자를 사용할 수 있다.
// 스위프트의 기본 데이터 타입은 모두 구조체로 구현되어 있기 때문에 값 타입이다.

let valueA: Int = 3
let valueB: Int = 5
let valueC: Int = 5

var isSameValue: Bool = false
isSameValue = valueA == valueB
print(isSameValue)
isSameValue = valueB == valueC
print(isSameValue)

var biggerValue: Int = valueA > valueB ? valueA : valueB

/*
    범위 연산자
    폐쇄 범위 연산자 A...B - A부터 B까지의 수를 묶어 범위를 표현 (A와 B를 포함)
    반폐쇄 범위 연산자 A..<B - A부터 B미만까지의 수를 묶어 범위를 표현
    단방향 범위 연산자 A... - A 이상의 수를 묶어 범위 표현
    단방향 범위 연산자 ...A - A 이하의 수를 묶어 범위 표현
    단방향 범위 연산자 ..<A - A 미만의 수를 묶어 범위 표현
*/

/*
    오버플로 연산자
    &+ 오버플로에 대비한 덧셈 연산
    &- 오버플로에 대비한 뺄셈 연산
    &* 오버플로에 대비한 곱셉 연산

    예를들어 UInt8 타입은 양의 정수만을 표현하기 때문에 0아래로 내려가는 계산을 하면 런타임 오류가 발생한다.
*/
var uInt: UInt8 = 0
let underflowedValue: UInt8 = uInt &- 1 // 255
print(uInt)
uInt = UInt8.max
let overflowedValue: UInt8 = uInt &+ 1 // 0
print(uInt)

/*
    기타 연산자
    A ?? B  - A가 nil이 아니면 A를 반환하고 nil이면 B를 반환한다.
    -A  - A의 부호를 변경한다.
    O!  - O(옵셔널 객체)의 값을 강제로 추출한다.(지양할 것)
    V?  - V(옵셔널 값)를 안전하게 추출하거나, V가 옵셔널임을 표현한다.
*/

// 사용자 정의 연산자
// prefix : 전위 연산자, infix : 중위 연산자, postfix : 후위 연산자
prefix operator **
prefix func ** (value: Int) -> Int {
    return value * value
}

let minusFive: Int = -5
let sqrtMinusFive: Int = **minusFive
print(sqrtMinusFive)

prefix func ! (value: String) -> Bool {
    return value.isEmpty
}

var stringValue: String = "hyunjin"
var isEmptyString: Bool = !stringValue
print(isEmptyString)

// 다른 타입에서도 동작할 수 있도록 중복 정의할 수 있다.
prefix func ** (value: String) -> String {
    return value + " " + value
}

let resultString: String = **"hyunjin"
print(resultString)

postfix operator **
postfix func ** (value: Int) -> Int {
    return value + 10
}
let five: Int = 5
let fivePlusTen: Int = five**
print(fivePlusTen)

let sqrtFivePlusTen: Int = **five** // 후위연선자를 먼저 수행한다.
print(sqrtFivePlusTen) // (10 + 5) * (10 + 5)

/*
    중위 연산자
    연산자 우선순위 그룹은 중위 연산자에서만 사용된다. 
    ```
    precedencegroup 우선순위 그룹 이름 {
        higherThan: 더 낮은 우선순위 그룹 이름
        lowerThan: 더 높은 우선순위 그룹 이름
        associativity: 결합방향(left / right / none) 기본으로 none설정
        assignment: 할당방향 사용(true / false) true인 경우 옵셔널 체이닝을 할 때 오른쪽 부터 체이닝 시작, false는 왼쪽부터
    }
    ```
    중위 연산자를 정의할 때 우선순위 그룹을 명시하지 않으면 우선순위가 가장 높은 DefaultPrecedence 그룹에 들어간다.
*/


// String 타입의 contains(_:) 메서드를 사용하기 위한 프레임워크 임포트
import Foundation

infix operator ** : MultiplicationPrecedence

func ** (lhs: String, rhs: String) -> Bool {
    return lhs.contains(rhs)
}

let helloHyunJin: String = "Hello hyunjin"
let hyunjin: String = "hyunjin"
let isContainsHyunjin: Bool = helloHyunJin ** hyunjin
print(isContainsHyunjin)

class Car {
    var modelYear: Int?
    var modelName: String?
}

struct SmartPhone {
    var company: String?
    var model: String?
}

// Car 클래스의 인스턴스끼리 == 연산 시 modelName이 같다면 true 반환
func == (lhs: Car, rhs: Car) -> Bool {
    return lhs.modelName == rhs.modelName
}

// SmartPhone 구조체의 인스턴스끼리 == 연산 시 model이 같다면 true 반환
func == (lhs: SmartPhone, rhs: SmartPhone) -> Bool {
    return lhs.model == rhs.model
}

let myCar = Car()
myCar.modelName = "S"
let yourCar = Car()
yourCar.modelName = "S"
print(myCar == yourCar)

var myPhone = SmartPhone()
myPhone.model = "SE"
var yourPhone = SmartPhone()
yourPhone.model = "12"
print(myPhone == yourPhone)

// 위의 경우 사용자 정의 메서드를 전역함수로 구현하기 보다 타입 내부에 구현하는 것이 읽고 이해하기 쉽다.
class Car2 {
    var modelYear: Int?
    var modelName: String?

    static func == (lhs: Car2, rhs: Car2) -> Bool {
        return lhs.modelName == rhs.modelName
    }
}

struct SmartPhone2 {
    var company: String?
    var model: String?

    static func == (lhs: SmartPhone2, rhs: SmartPhone2) -> Bool {
        return lhs.model == rhs.model
    }
}

let myCar2 = Car2()
myCar2.modelName = "S"
let yourCar2 = Car2()
yourCar2.modelName = "S"
print(myCar2 == yourCar2)

var myPhone2 = SmartPhone2()
myPhone2.model = "SE"
var yourPhone2 = SmartPhone2()
yourPhone2.model = "12"
print(myPhone2 == yourPhone2)