/* 다른 문법과 달리 함수에서는 소괄호를 생략할 수 없다.
    ```
        func 함수이름(매개변수...) -> 반환타입 {
            실행구문
            return 반환값
        }
    ```
*/
func hello(name: String) -> String {
    return "Hello \(name)!"
}
let helloJenny: String = hello(name: "Jenny")
print(helloJenny)
/*
    매개변수와 전달인자
    매개변수는 함수를 정의할 때 외부로부터 받아들이는 전달 값의 이름을 의미한다.
    전달인자는 함수를 실제로 호출할 때 전달하는 값을 의미한다.
    위에서 name은 매개변수, "Jenny"는 전달인자다.
*/
func introduce(name: String) -> String {
    "제 이름은 " + name + "입니다." // 함수 내부의 코드가 한줄이고, 결과값의 타입이 함수의 반환타입과 일치한다면 return 키워드를 생략할 수 있다.
}

// 매개변수
func helloWorld() -> String {
    "Hello, world!"
}
print(helloWorld())

func sayHello(myName: String, yourName: String) -> String {
    "Hello \(yourName)! I'm \(myName)"
}
// 호출 시에 매개변수 이름을 붙여준다. 이를 매개변수 이름(Parameter Name)이라고 한다.
print(sayHello(myName: "hyunjin", yourName: "Jenny"))

// 전달인자 레이블
// 전달인자 레이블을 별도로 지정하면 함수 외부에서 매개변수의 역할을 좀 더 명확히 할 수 있다.
// 전달인자 레이블을 사용하려면 함수정의에서 매개변수 이름 앞에 한 칸을 띄운 후 전달인자 레이블을 지정한다.
func sayHiWithLabel(from myName:String, to name:String) -> String {
    "Hello \(name)! I'm \(myName)"
}

print(sayHiWithLabel(from: "hyunjin", to: "Jenny"))

// 다른 언어처럼 레이블을 사용하고 싶지 않다면 와일드카드 식별자를 사용하자
func sayHiWithoutLabel(_ name: String, _ times: Int) -> String {
    var result: String = ""
    for _ in 0..<times {
        result += "Hello \(name)!" + " "
    }
    return result
}

print(sayHiWithoutLabel("jin", 2))

// 함수 오버로드
// 전달인자 레이블을 변경해도 오버로드 할 수 있다.
func sayHello(to name: String, _ times: Int) -> String {
    var result: String = ""
    for _ in 0..<times {
        result += "Hello \(name)!" + " "
    }
    return result
}

func sayHello(to name: String, repeatCount times: Int) -> String {
    var result: String = ""
    for _ in 0..<times {
        result += "Hello \(name)!" + " "
    }
    return result
}

print(sayHello(to:"jin", 2))
print(sayHello(to:"jin", repeatCount:2))

// 매개변수 기본값
func sayHello(_ name: String, times: Int = 3) -> String {
    var result: String = ""
    for _ in 0..<times {
        result += "Hello \(name)!" + " "
    }
    return result
}

print(sayHello("jenny"))
print(sayHello("jenny", times:2))
// 기본값이 없는 매개변수는 대체로 함수를 사용함에 중요한 값일 가능성이 높습니다.
// 따라서 앞쪽에 배치하세요.
/*
    print 함수
    원형
    public func print(_ items: Swift.Any..., separator: String = default, terminator: String = default)
    separator 기본값: 공백
    terminator 기본값: \n
*/

// 가변 매개변수와 입출력 매개변수
// 함수마다 가변 매개변수는 하나만 가질 수 있다.
func sayHelloToFriends(me: String, friends names: String...) -> String {
    var result: String = ""

    for friend in names {
        result += "Hello \(friend)! \n"
    }
    result += "I'm " + me + "!"
    return result
}

print(sayHelloToFriends(me:"hyunjin", friends: "Jenny", "max", "ferez"))
print(sayHelloToFriends(me:"hyunjin"))

// 함수의 전달인자로 값을 전달할 때는 보통 값을 복사해서 전달한다.
// 참조를 전달하려면 입출력 매개변수를 사용한다.
// => 함수형 프로그래밍 패러다임에서는 지양한다.
// 1. 함수를 호출할 때 전달인자 값 복사
// 2. 함수내부에서 복사한 값 변경
// 3. 반환 시점에 변경된 값을 원본에 할당
// 연산 프로퍼티 또는 감시자가 있는 프로퍼티가 입출력 매개변수로 전달되면
// 함수 호출 시점에 그 프로퍼티의 접근자가 호출되고
// 반환 시점에 설정자가 호출된다.

// inout 매개변수로 전달될 변수 또는 상수 앞에는 &를 붙여 표현한다.
func nonRefParam(_ arr: [Int]) {
    // arr[1] = 1 // cannot assign through subscript: 'arr' is a 'let' constant 
}

func refParam(_ arr: inout [Int]) {
    arr[1] = 1
}

var numbers: [Int] = [1, 2, 3]
nonRefParam(numbers)
print(numbers[1])
refParam(&numbers) // & 붙임
print(numbers[1])
// 입출력 매개변수는 기본값을 가질 수 없으며, 가변 매개변수로 사용될 수 없다.
// 상수도 입출력 매개변수의 전달인자로 사용될 수 없다.
// 잘못 사용하면 메모리 안전을 위협하기도 한다.

// 반환이 없는 함수
// 반환타입을 Void로 하거나 아예 반환 타입 표현을 생략해도 된다.
func sayHello() {
    print("Hello, world")
}
sayHello()

func sayHello(from myName: String, to name: String) {
    print("Hello \(name)! I'm \(myName)")
}
sayHello(from: "hyunjin", to: "jenny")

func sayGoodBye() -> Void {
    print("Good bye~")
}
sayGoodBye()

// 데이터 타입으로서의 함수
// 스위프트의 함수는 일급 객체이므로 하나의 데이터 타입으로 사용될 수 있다.
// (매개변수 타입의 나열) -> 반환 타입

typealias CalculateTwoInt = (Int, Int) -> Int

func addTwoInts(_ a: Int, _ b: Int) -> Int {
    return a + b
}

func multiplyTwoInts(_ a: Int, _ b: Int) -> Int {
    return a * b
}

var mathFunc: CalculateTwoInt = addTwoInts
print(mathFunc(2, 5))

mathFunc = multiplyTwoInts
print(mathFunc(2, 5))

func printWithResult(_ mathFunc: CalculateTwoInt, _ a: Int, _ b: Int) {
    print("Result: \(mathFunc(a, b))")
}

printWithResult(mathFunc, 3, 5)

func chooseMathFunc(_ toAdd: Bool) -> CalculateTwoInt {
    return toAdd ? addTwoInts : multiplyTwoInts
}

printWithResult(chooseMathFunc(true), 3, 5)

// 중첩 함수
// 앞서 살펴본 함수들은 전역 함수다. 모듈 어디서든 사용할 수 있다.
// 함수 안의 함수는 함수 내부에서만 사용할 수 있다.
// 물론 내부의 함수를 외부로 반환하면 밖에서도 사용할 수 있다.


typealias MoveFunc = (Int) -> Int

func functionForMove(_ sholdGoLeft: Bool) -> MoveFunc {
    func goRight(_ currentPosition: Int) -> Int {
        return currentPosition + 1
    }

    func goLeft(_ currentPosition: Int) -> Int {
        return currentPosition - 1
    }

    return sholdGoLeft ? goLeft : goRight
}

var position: Int = 3

let moveToZero: MoveFunc = functionForMove(position > 0)
print("원점으로 갑시다.")
while position != 0 {
    print("현재위치: \(position)")
    position = moveToZero(position)
}
print("원점 도착")

// 종료되지 않는 함수
// 스위프트에는 종료되지 않는 함수가 있다.
// => 비반환 함수, 비반환 메서드
// 오류를 던진다거나 오류를 보고하는 등의 일을 하고 프로세스를 종료함
// 비반환 함수(메서드)는 반환 타입을 Never라고 명시해주면 된다.

func crashAndBurn() -> Never {
    fatalError("Something very, very bad happend")
}

// crashAndBurn()

func someFunc(isAllIsWell: Bool) {
    guard isAllIsWell else {
        print("마을에 도둑이 들었습니다.")
        crashAndBurn()
    }
    print("All is well")
}
someFunc(isAllIsWell: true)
// someFunc(isAllIsWell: false)

// 반환 값을 무시할 수 있는 함수
@discardableResult func say(_ something: String) -> String {
    print(something)
    return something
}
say("hello")

