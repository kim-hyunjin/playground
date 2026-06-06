// 제네릭으로 구현한 기능과 타입은 재사용하기도 쉽고, 코드의 중복을 줄일 수 있어 깔끔하고 추상적인 표현이 가능하다.
// Array, Dictionary, Set 등의 타입은 모두 제네릭 컬렉션이다.
// 여러 개의 타입 매개변수를 갖고 싶다면 <T, U, V> 처럼 쉼표로 분리해 여러 개 지정하면 된다.
// 딕셔너리의 <Key, Value> 처럼 의미있는 이름으로 제네릭 함수와 타입 매개변수와의 관계를 조금 더 명확히 표현해 줄 수 있다.

// 제네릭 함수
func swapTwoValues<T>(_ a: inout T, _ b: inout T) {
    let temp: T = a
    a = b
    b = temp
}

// 제네릭 타입
struct Stack<Element> {
    var items = [Element]()
    mutating func push(_ item: Element) {
        items.append(item)
    }
    mutating func pop() -> Element {
        return items.removeLast()
    }
}

var doubleStack: Stack<Double> = Stack<Double>()
doubleStack.push(1.0)
print(doubleStack.items)
print(doubleStack.pop())

// 제네릭 타입 확장
extension Stack { // 익스텐션의 정의에는 따로 타입 매개변수를 명시해주지 않는다.
    // 대신 기존의 제네릭 타입에 정의되어 있는 Element라는 타입을 사용할 수 있다.
    var topElement: Element? {
        return self.items.last
    }
}

// 타입 제약
// 특정 타입, 특정 프로토콜을 따르는 타입만 사용할 수 있도록 제약을 두어야 하는 상황에서
// 제약사항을 지정할 수 있다.
// 타입 제약은 클래스 타입 또는 프로토콜로만 가능하다.
// public struct Dictionary<Key: Hashable, Value> : Collection, ExpressibleByDictionaryLiteral
// => Key 타입은 Hashable 프로토콜을 준수해야 한다.

// 여러 제약을 추가하고 싶다면 where 절을 사용할 수 있다.
func swapValues<T: BinaryInteger>(_ a: inout T, _ b: inout T) where T: FloatingPoint {

}

func makeDictionaryWithTwoValue<Key: Hashable, Value>(key: Key, value: Value) -> Dictionary<Key, Value> {
    let dictionary: Dictionary<Key, Value> = [key:value]
    return dictionary
}

// 프로토콜 연관 타입
// 프로토콜을 정의할 때 연관 타입을 함께 정의하면 유용하다.
// 연관 타입: 프로토콜에서 사용할 수 있는 플레이스홀더 이름.
protocol Container {
    associatedtype ItemType //  연관타입
    var count: Int {get}
    mutating func append(_ item: ItemType)
    subscript(i: Int) -> ItemType {get}
}

class MyContainer: Container {
    var items: Array<Int> = Array<Int>()

    var count: Int {
        return items.count
    }

    func append(_ item: Int) {
        items.append(item)
    }

    subscript(i: Int) -> Int {
        return items[i]
    }
}

// Container 의 ItemType을 어떤 타입으로 사용할지 타입 별칭을 통해 명확히 할 수 있다.
struct IntStack: Container {
    typealias ItemType = Int
    
    var items = [ItemType]()
    mutating func push(_ item: ItemType) {
        items.append(item)
    }
    mutating func pop() -> ItemType {
        return items.removeLast()
    }

    // Container 프로토콜 준수를 위한 구현
    mutating func append(_ item: ItemType) {
        self.push(item)
    }
    var count: ItemType {
        return items.count
    }
    subscript(i: ItemType) -> ItemType {
        return items[i]
    }
}

// Stack 구조체에서 ItemType이라는 연관 타입 대신
// Element라는 타입 매개변수를 사용하더라도 Container 프로토콜을 완벽히 준수한다.
struct Stack2<Element>: Container {
    var items = [Element]()
    mutating func push(_ item: Element) {
        items.append(item)
    }
    mutating func pop() -> Element {
        return items.removeLast()
    }

    // Container 프로토콜 준수를 위한 구현
    mutating func append(_ item: Element) {
        self.push(item)
    }
    var count: Int {
        return items.count
    }
    subscript(i: Int) -> Element {
        return items[i]
    }
}

// 제네릭 서브스크립트
extension Stack2 {
    subscript<Indices: Sequence>(indices: Indices) -> [Element] where Indices.Iterator.Element == Int {
        var result = [Element]()
        for index in indices {
            result.append(self[index])
        }
        return result
    }
}

var intStack: Stack2<Int> = Stack2<Int>()
intStack.append(1)
intStack.append(2)
intStack.append(3)
intStack.append(4)

print(intStack[0...2])