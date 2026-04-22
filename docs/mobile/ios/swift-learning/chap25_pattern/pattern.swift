/*
    스위프트의 패턴은 크게 두 종류로 나뉜다.
    1. 값을 해체(추출)하거나 무시하는 패턴
        - 와일드카드 패턴, 식별자 패턴, 값 바인딩 패턴, 튜플 패턴
    2. 패턴 매칭을 위한 패턴
        - 열거형 케이스 패턴, 옵셔널 패턴, 표현 패턴, 타입캐스팅 패턴
*/

// 와일드카드 패턴
// 와일드카드 식별자(_)가 위치한 곳의 값은 무시한다.
let str: String = "ABC"
switch str {
case _: print(str) // 어떤 값이 와도 상관없기 때문에 항상 실행된다.
}

let optionalStr: String? = "ABC"
switch optionalStr {
case "ABC"?: print(optionalStr as Any)
case _?: print("값이 있지만 ABC는 아님")
case nil: print("nil")    
}

let hyunjin = ("hyunjin", 29, "Male")

switch hyunjin {
case ("hyunjin", _, _): print("hello hyunjin") // 첫번째 요소가 hyunjin일때 실행
case (_, _, _): print("안녕") // 그 외 언제든지 실행
}

for _ in 0..<2 {
    print("hello")
}

// 식별자 패펀
// 변수 또는 상수의 이름에 알맞는 값을 어떤 값과 매치시키는 패턴
let someVal: Int = 42 // someVal은 42라는 값의 식별자가 된다.

// 값 바인딩 패턴
// 변수 또는 상수의 이름에 매치된 값을 바인딩하는 것
switch hyunjin {
case let (name, age, gender): print("Name: \(name), Age: \(age), Gender: \(gender)") // 튜플의 각 요소와 바인딩한다.
}

// 튜플 패턴
let (x, y): (Int, Int) = (1, 2)

let name: String = "hyunjin"
let age: Int = 29
let gender: String? = "Male"

switch (name, age, gender) {
case ("hyunjin", _, _): print("hello hyunjin")
case (_, _, "Male"?): print("당신은 남자")    
default: print("I don't know who you are")
}

// 열거형 케이스 패턴
// 값을 열거형 타입의 case와 매치시킨다.

let someValue: Int = 55
if case 0...100 = someValue {
    print("0 <= \(someValue) <= 100")
}

let anotherVal: String = "ABC"
if case "ABC" = anotherVal {
    print(anotherVal)
}

enum MainDish {
    case pasta(taste: String)
    case pizza(dough: String, topping: String)
    case chicken(withSauce: Bool)
    case rice
}

var dishes: [MainDish] = []

var dinner: MainDish = .pasta(taste: "크림")
dishes.append(dinner)

if case .pasta(let taste) = dinner {
    print("\(taste) 파스타")
}

dinner = .pizza(dough: "치즈크러스트", topping: "불고기")
dishes.append(dinner)

func pizzaChecker(dish: MainDish) {
    guard case .pizza(let dough, let topping) = dish else {
        print("It's not pizza")
        return
    }
    print("\(dough) \(topping) pizza")
}

pizzaChecker(dish: dinner)

dinner = .chicken(withSauce: true)
dishes.append(dinner)

while case .chicken(let sauced) = dinner {
    print("\(sauced ? "양념" : "후라이드") 통닭")
    break
}

dinner = .rice
dishes.append(dinner)

if case .rice = dinner {
    print("rice")
}

for dish in dishes {
    switch dish {
    // 연관값이 있는 경우 같이 명시해줘야 한다.
    case let .pasta(taste): print("\(taste) 파스타")
    case let .pizza(dough, topping): print("\(dough) \(topping) 피자")
    case let .chicken(sauced): print(sauced ? "양념치킨" : "후라이드 치킨")
    case .rice: print("그냥 쌀")
    }
}

// 옵셔널 패턴
var optionalValue: Int? = 100

if case .some(let value) = optionalValue {
    print(value)
}

if case let value? = optionalValue {
    print(value)
}

func isHasValue(_ optionalValue: Int?) {
    guard case .some(let value) = optionalValue else {
        print("값이 없음")
        return
    }

    print(value)
}

isHasValue(optionalValue)

let arrOfOptionalInt: [Int?] = [nil, 2, 3, nil, 5]

for case let number? in arrOfOptionalInt {
    print("Found a \(number)")
}

// 타입캐스팅 패턴
// is패턴과 as패턴이 있다.
// is 패턴은 switch의 case 레이블에서만 사용할 수 있다.
// is 패턴은 프로그램 실행 중 값의 타입이 is 우측의 타입 또는 그 타입의 자식클래스이면 값과 매치시킨다.
let aValue: Any = 100

switch aValue {
case is String: print("It's String!") // 타입은 확인하지만 캐스팅된 값은 사용할 수 없다.
case let value as Int: print(value + 1) // 타입확인과 동시에 캐스팅 완료.
default: print("Int도 String도 아니다.")   
}

// 표현 패턴
// 표현식의 값을 평가한 결과를 이용한다 switch 구문의 case 레이블에서만 사용할 수 있다.
// 패턴 연산자 ~= 연산 결과가 true이면 매치시킨다. Range 객체와 매치시킬 수도 있다.
switch 3 {
case 0...5: print("0과 5사이입니다.")
default: print("0보다 작거나 5보다 큽니다.")
}

var point: (Int, Int) = (1, 2)

switch point {
case (0, 0): print("원점")
case (-2...2, -2...2): print("\(point.0), \(point.1)은 원점과 가깝다.")
default: print("point (\(point.0), \(point.1))")
}

// String과 Int 타입이 매치될 수 있도록 ~= 연산자를 정의
func ~= (pattern: String, value: Int) -> Bool {
    return pattern == "\(value)"
}

switch point {
case ("0", "0"): print("원점") // 새로 정의된 ~= 연산자를 사용해 비교한다.
default: print("point (\(point.0), \(point.1))")
}

struct Person {
    var name: String
    var age: Int
}

let lingo: Person = Person(name: "Lingo", age: 99)

func ~= (pattern: String, value: Person) -> Bool {
    return pattern == value.name
}
func ~= (pattern: Person, value: Person) -> Bool {
    return pattern.name == value.name && pattern.age == value.age
}

switch lingo {
case Person(name: "Lingo", age:99): print("같은 사람!")
case "Lingo": print("안녕 Lingo!")
default: print("I don't know who you are")
}

// 제네릭을 사용한 표현 패턴 활용
protocol Personalize {
    var name: String {get}
    var age: Int {get}
}

struct PersonStruct: Personalize {
    var name: String
    var age: Int
}

let star: PersonStruct = PersonStruct(name: "IU", age:29)

func ~= <T: Personalize>(pattern: String, value: T) -> Bool {
    return pattern == value.name
}
func ~= <T: Personalize>(pattern: T, value: T) -> Bool {
    return pattern.name == value.name && pattern.age == value.age
}

switch star {
case PersonStruct(name: "IU", age:29): print("IU!")
case "IU": print("안녕 IU!")
default: print("I don't know who you are")
}

// 패턴을 함수로
func ~=<T: Personalize>(pattern: (T) -> Bool, value: T) -> Bool {
    return pattern(value)
}

func young<T: Personalize>(value: T) -> Bool {
    return value.age < 30
}

switch star {
    // 패턴 결합을 하면 young(star)와 같은 효과를 본다.
case young: print("\(star.name) is young")
default: print("\(star.name) is old")
}

// 패턴에 사용할 제네릭 함수
func isNamed<T: Personalize>(_ pattern: String) -> ((T) -> Bool) {
    return {(value: T) -> Bool in value.name == pattern}
} // 패턴과 값을 비교할 클로저를 리턴

switch star {
case isNamed("IU"): print("you are IU")
default: print("another person")
}

prefix operator ==?

prefix func ==? <T: Personalize>(pattern: String) -> ((T) -> Bool) {
    return isNamed(pattern)
}

switch star {
    // 패턴결합을 하면 isNamed("IU")(star)와 같은 효과를 본다.
case ==?"IU": print("you are IU")
default: print("another person")
}

// 단순히 패턴에 함수를 사용하는 것을 넘어 제네릭을 사용해 프로토콜을 준수하는 타입 모두가 공통으로 매칭이 될 수 있다.