// 클로저는 일정 기능을 하는 코드를 하나의 블록으로 모아놓은 것을 말한다.
// 함수는 클로저의 한 형태
// 클로저의 세 가지 형태
// - 이름이 있으면서 어떤 값도 획득하지 않는 전역함수의 형태
// - 이름이 있으면서 다른 함수 내부의 값을 획득할 수 있는 중첩된 함수의 형태
// - 이름이 없고 주변 문맥에 따라 값을 획득할 수 있는 축약 문법으로 작성한 형태

// 클로저는 매개변수와 반환 값의 타입을 문맥을 통해 유추할 수 있기 때문에 매개변수와 반환 값의 타입을 생략할 수 있다.
// 클로저에 단 한 줄의 표현만 들어있다면 암시적으로 이를 반환 값으로 취급한다.
// 축약된 전달인자 이름을 사용할 수 있다.
// 후행 클로저 문법을 사용할 수 있다.

// 기본 클로저
func backwards(first: String, second: String) -> Bool {
    print("\(first)와 \(second) 비교중")
    return first > second
}

let names: [String] = ["max", "ferez", "hyunjin", "hamilton"]
let reversed: [String] = names.sorted(by: backwards)
print(reversed)

/*
    위 표현을 클로저를 사용해 간결하게 표현하기
    { (매개변수들) -> 반환타입 in
        실행코드
    }
*/
let reversed2: [String] = names.sorted(by: { (first: String, second: String) -> Bool in
    return first > second
})
print(reversed2)

// 후행 클로저
// 함수나 메서드의 마지막 인자에 위치하는 클로저는 함수나 메서드의 소괄호를 닫은 후 작성해도 된다.
// 클로저가 조금 길어지거나 가독성이 떨어지면 후행 클로저 기능을 사용하면 좋다.
let reversed3: [String] = names.sorted() { (first: String, second: String) -> Bool in
    return first > second
}
print(reversed3)

// sorted(by:)의 소괄호까지 생략할 수 있다.
let reversed4: [String] = names.sorted { (first: String, second: String) -> Bool in
    return first > second
}
print(reversed4)

// 클로저 표현 간소화
// 문맥을 이용한 타입 유추
// 메서드의 전달인자로 전달하는 클로저는 메서드에서 요구하는 형태로 전달해야 한다.
// 즉, 인자로 전달할 클로저는 이미 적합한 타입을 준수하고 있다고 유추할 수 있다.
let reversed5: [String] = names.sorted { (first, second) in // 타입 생략
    return first > second
}

// 단축 인자 이름 생략
// 단축 인자 이름은 첫 번째 전달인자부터 $0, $1, $2, ... 로 표현된다.
// 단축 인자 표현을 사용하게 되면 매개변수 및 반환 타입과 실행 코드를 구분하기 위해 사용했던 in 키워드도 사용할 필요가 없어진다.
let reversed6: [String] = names.sorted {
    return $0 > $1
}

// 암시적 반환 표현
// 클로저 내부의 실행문이 단 한 줄이라면 그 실행문을 반환 값으로 사용할 수 있다.
let reversed7: [String] = names.sorted { $0 > $1 }

// 값 획득
// 클로저는 자신이 정의된 위치의 주변 문맥을 통해 상수나 변수를 획득(capture)할 수 있다.
// 비동기 작업에 많이 사용된다.
func makeIncrementer(forIncrementer amount: Int) -> (() -> Int) { // 함수 객체를 반환
    var runningTotal = 0
    func incrementer() -> Int {
        runningTotal += amount
        return runningTotal
    }
    return incrementer
}

let incrementerByTwo: (() -> Int) = makeIncrementer(forIncrementer: 2)
let first: Int = incrementerByTwo()
let second: Int = incrementerByTwo()
print(second)

let incrementerByThree: (() -> Int) = makeIncrementer(forIncrementer: 3)
let first2: Int = incrementerByThree()
let second2: Int = incrementerByThree()
print(second2)
// incrementer 함수는 언제 호출이 되더라도 자신만의 runningTotal 변수를 갖고 카운팅한다. 각각 자신만의 runningTotal의 참조를 미리 획득했기 때문이다.

// 클로저는 참조 타입
let sameWithIncrementerByTwo: (() -> Int) = incrementerByTwo
print(sameWithIncrementerByTwo())

// 탈출 클로저
// 함수의 전달인자로 전달한 클로저가 함수 종료 후에 호출될 때 클로저가 함수를 탈출한다고 표현한다.
// 클로저를 매개변수로 갖는 함수를 선언할 때 매개변수 이름의 콜론(:) 뒤에 @escaping 키워드를 사용해 클로저의 탈출을 허용한다고 명시해줄 수 있다.
// 함수로 전달된 클로저가 함수의 동작이 끝난 후 사용할 필요가 없을 땐 비탈출 클로저를 사용한다.

// 클로저가 함수를 탈출할 수 있는 경우 중 하나는 함수 외부에 정의된 변수나 상수에 저장되어 함수가 종료된 후에 사용할 경우다.
var completionHandlers: [() -> Void] = []

func someFnWithEscapingClosure(completionHandler: @escaping () -> Void) {
    completionHandlers.append(completionHandler)
}


typealias VoidVoidClosure = () -> Void

let firstClosure: VoidVoidClosure = {
    print("Closure A")
}
let secondClosure: VoidVoidClosure = {
    print("Closure B")
}

func returnOneClosure(first: @escaping VoidVoidClosure, second: @escaping VoidVoidClosure, shouldReturnFirstClosure: Bool) -> VoidVoidClosure {
    return shouldReturnFirstClosure ? first : second
}

let returnedClosure: VoidVoidClosure = returnOneClosure(first: firstClosure, second: secondClosure, shouldReturnFirstClosure: true)
returnedClosure()

var closures: [VoidVoidClosure] = []

func appendClosure(closure: @escaping VoidVoidClosure) {
    closures.append(closure)
}

// 메서드의 매개변수에 탈출 클로저를 명시한 경우, 클로저 내부에서 해당 타입의 프로퍼티나 메서드, 서브스크립트 등에 접근하려면 self 키워드를 명시적으로 사용해야 한다.
// 즉 탈출하는 클로저는 self 키워드를 사용해서 클래스의 프로퍼티에 접근해야 한다.
// 비탈출 클로저에서 self 키워드는 선택사항.

// withoutActuallyEscaping(_:do:)
// 탈출 클로저 자리에 비탈출 클로저를 전달해야할 때 사용하는 함수
/*
    아래 함수에서 lazy 컬렉션은 비동기 작업을 할 때 사용하기 때문에 filter 메서드가 요구하는 클로저는 탈출 클로저다.
    하지만 hasElements에 넘겨준 클로저는 비탈출 클로저이므로 오류가 발생한다.
    func hasElements(in array: [Int], match predicate: (Int) -> Bool) -> Bool {
        return (array.lazy.filter { predicate($0) }.isEmpty == false)
    }
*/
let numbers: [Int] = [2, 4, 6, 8]
let evenNumberPredicate = {
    (number: Int) -> Bool in
    return number % 2 == 0
}
let oddNumberPredicate = {
    (number: Int) -> Bool in
    return number % 2 == 1
}

/*
    withoutActuallyEscaping(_:do:) 함수의 첫번째 전달인자로 탈출 클로저인 척해야 하는 클로저,
    do 전달인저로 비탈출클로저를 매개변수로 받아 실제 작업을 실행할 탈출 클로저
*/
func hasElements(in array: [Int], match predicate: (Int) -> Bool) -> Bool {
    return withoutActuallyEscaping(predicate, do: { escapablePredicate in
        return (array.lazy.filter { escapablePredicate($0) }.isEmpty == false)
    })
}

let hasEvenNumber = hasElements(in: numbers, match: evenNumberPredicate)
let hasOddNumber = hasElements(in: numbers, match: oddNumberPredicate)

print(hasEvenNumber)
print(hasOddNumber)

// 자동 클로저
var customersInLine: [String] = ["ssangbae", "chim", "jinbae", "yabu"]

// 클로저를 만들어두면 클로저 내부의 코드를 미리 연산하지 않고 가지고만 있는다.
let customerProvider: () -> String = {
    return customersInLine.removeFirst()
}

print("customersInLine.count \(customersInLine.count)")
print("Now Serving \(customerProvider())!")
print("customersInLine.count \(customersInLine.count)")

func serveCustomer(_ customerProvider: () -> String) {
    print("Now Serving \(customerProvider())!")
}
serveCustomer({ customersInLine.removeFirst() })

// 자동 클로저 사용 예
// 자동 클로저는 매개변수가 없어야 한다.
func serveCustomer(_ customerProvider: @autoclosure () -> String) {
    print("Now Serving \(customerProvider())!")
}
serveCustomer(customersInLine.removeFirst())

// 기본적으로 @autoclosure 속성은 @noescape 속성을 포함한다.
// 만약 자동 클로저를 탈출 클로저로 사용하고 싶다면 @autoclosure @escaping처럼 사용하면 된다.
func returnProvider(_ customerProvider: @autoclosure @escaping () -> String) -> (() -> String) {
    return customerProvider
}
let customerProvider2: () -> String = returnProvider(customersInLine.removeFirst())
print(customerProvider2)