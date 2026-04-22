// 패턴과 결합하여 조건 추가
// 타입에 대한 제약 추가

let tuples: [(Int, Int)] = [(1, 2), (1, -1), (1, 0), (0, 2)]

for tuple in tuples {
    switch tuple {
        case let (x, y) where x == y: print("x == y")
        case let (x, y) where x == -y: print("x == -y")
        case let (x, y) where x > y: print("x > y")
        case (1, _): print("x == 1")
        case (_, 2): print("y == 2")
        default: print("\(tuple.0), \(tuple.1)")
    }
}

var repeatCount: Int = 0
for tuple in tuples {
    switch tuple {
    case let (x, y) where x == y && repeatCount > 2: print("x == y and repeatCount > 2")
    case let (x, y) where repeatCount < 2: print("\(x), \(y)")
    default: print("Nothing")
    }

    repeatCount += 1
}

let firstValue: Int = 50
let secondValue: Int = 30
switch firstValue + secondValue {
case let total where total > 100: print("total > 100")
case let total where total < 0: print("negative value")
case let total where total == 0: print("zero")
case let total: print(total)
}

let arrOfOptional: [Int?] = [1, 2, nil, 4, nil]
for case let number? in arrOfOptional where number > 2 {
    print("Found a \(number)")
}

// 타입캐스팅 패턴과 where절의 활용
let anyValue: Any = "ABC"

switch anyValue {
case let value where value is Int: print("value is Int")
case let value where value is String: print("value is String")
case let value where value is Double: print("value is Double")
default: print("not int, string, double") 
}

var point: (Int, Int) = (1, 2)

switch point {
case (0, 0): print("원점")
case (-2...2, -2...2) where point.0 != 1: print("원점과 가까움")
default: print("\(point)")
}

// 프로토콜 익스텐션에 where절을 사용하면 이 익스텐션이 특정 프로토콜을 준수하는 타입에만 적용될 수 있도록 제약할 수 있다.
protocol SelfPrintable {
    func printSelf()
}

struct Person: SelfPrintable {}

extension Int: SelfPrintable {}

extension SelfPrintable where Self: FixedWidthInteger, Self: SignedInteger {
    func printSelf() {
        print("FixedWidthInteger, SignedInteger을 준수하면서 SelfPrintable을 준수하는 타입 \(type(of: self))")
    }
}
extension SelfPrintable where Self: CustomStringConvertible {
    func printSelf() {
        print("CustomStringConvertible을 준수하면서 SelfPrintable을 준수하는 타입 \(type(of: self))")
    }
}
extension SelfPrintable {
    func printSelf() {
        print("그 외 SelfPrintable을 준수하는 타입 \(type(of: self))")
    }
}

// 타입 매개변수와 연관 타입의 제약을 추가하는 데 where절을 사용하기도 한다.
// 제네릭 함수(메서드)의 반환 타입 뒤에 where절을 포함하면 타입 매개변수와 연관 타입에 요구사항을 추가할 수 있다.
// 요구사항이 여러 개일 때는 쉼포로 구분한다.

// 타입 매개변수 T가 BinaryInteger 프로토콜을 준수하는 타입
func doubled<T>(integerValue: T) -> T where T: BinaryInteger {
    return integerValue * 2
}
/*
    위 함수와 동일한 표현
    func doubled<T: BinaryInteger>(integerValue: T) -> T {
        return integerValue * 2
    }
*/

func prints<T, U>(first:T, second:U) where T: CustomStringConvertible, U: CustomStringConvertible {
    print(first)
    print(second)
}
/*
    위 함수와 동일한 표현
    func prints<T: CustomStringConvertible, U: CustomStringConvertible>(first:T, second:U) {
        print(first)
        print(second)
    }
*/

func compareToSequences<S1, S2>(a: S1, b: S2) 
    where S1: Sequence, S1.Element: Equatable, S2: Sequence,  S2.Element: Equatable {
        // ...
}

protocol Container {
    associatedtype ItemType where ItemType: BinaryInteger
    var count: Int {get}

    mutating func append(_ item: ItemType)
    
    subscript(i: Int) -> ItemType {
        get
    }
}
/*
    위와 동일한 표현
    protocol Container where ItemType: BinaryInteger {
    associatedtype ItemType
    var count: Int {get}

    mutating func append(_ item: ItemType)
    
    subscript(i: Int) -> ItemType {
        get
    }
} 
*/

// 연관타입이 특정 프로토콜을 준수하는 경우에만 제약을 줄 수 있다.
protocol Talkable {}
protocol CallToAll {
    func callToAll()
}

struct Person2: Talkable{}
struct Animal {}

extension Array: CallToAll where Element: Talkable {
    func callToAll() {}
}

let people: [Person2] = []
let cats: [Animal] = []

people.callToAll()
// cats.callToAll() // 컴파일 오류