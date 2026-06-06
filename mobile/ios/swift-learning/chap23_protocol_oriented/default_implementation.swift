protocol Receiveable {
    func received(data: Any, from: Sendable)
}

extension Receiveable {
    func received(data: Any, from: Sendable) {
        print("\(self) received \(data) from \(from)")
    }
}

protocol Sendable {
    var from: Sendable {get}
    var to: Receiveable? {get}

    func send(data: Any)

    static func isSendableInstance(_ instance: Any) -> Bool
}

extension Sendable {
    var from: Sendable {
        return self
    }

    func send(data: Any) {
        guard let receiver: Receiveable = self.to else {
            print("Message has no receiver")
            return
        }
        receiver.received(data: data, from: self.from)
    }

    static func isSendableInstance(_ instance: Any) -> Bool {
        if let sendableInstance: Sendable = instance as? Sendable {
            return sendableInstance.to != nil
        }
        return false
    }   
}

class Message: Sendable, Receiveable {
    var to: Receiveable?
}

class Mail: Sendable, Receiveable {
    var to: Receiveable?
}

let myMail: Mail = Mail()
let yourMail: Mail = Mail()

myMail.to = yourMail
myMail.send(data: "hi")

print(Message.isSendableInstance(myMail))

// Message와 Mail 클래스는 Receiveable, Sendable 프로토콜을 채택하고 있지만, 실제로 구현한 것은
// 저장 인스턴스 프로퍼티인 to 뿐이다.
// 그 외 기능은 이미 각 프로토콜의 익스텐션에 구현되어 있다.
// 이렇게 프로토콜과 익스텐션을 결합하면 코드의 재사용성이 월등히 증가한다.
// 프로토콜의 요구사항을 익스텐션을 통해 구현하는 것을 프로토콜 초기구현 이라고 한다.

// 타입의 특성에 따라 조금 변경해서 구현하고 싶다면 새로 구현하면 된다.
class MailOnlyRead: Sendable, Receiveable {
    var to: Receiveable?

    func send(data: Any) {
        print("Mail의 send 메서드는 재정의되었습니다.")
    }
}
// 특정 프로토콜을 준수하는 타입이 기능을 구현했다면 우선 호출하고, 그렇지 않다면 프로토콜의 초기구현의 기능을 호출한다.

protocol SelfPrintable {
    func printSelf()
}

extension SelfPrintable where Self: Container {
    func printSelf() {
        print(items)
    }
}

protocol Container: SelfPrintable {
    associatedtype ItemType // 연관 타입을 활용해 제네릭에 유연하게 대응

    var items: [ItemType] { get set }
    var count: Int { get }

    mutating func append(item: ItemType)
    subscript(i: Int) -> ItemType { get }
}

extension Container {
    mutating func append(item: ItemType) {
        items.append(item)
    }

    var count: Int {
        return items.count
    }

    subscript(i: Int) -> ItemType {
        return items[i]
    }   
}

protocol Popable: Container {
    mutating func pop() -> ItemType?
    mutating func push(_ item: ItemType)
}

extension Popable {
    mutating func pop() -> ItemType? {
        return items.removeLast()
    }
    
    mutating func push(_ item: ItemType) {
        self.append(item: item)
    }
}

protocol Insertable: Container {
    mutating func delete() -> ItemType?
    mutating func insert(_ item: ItemType)
}

extension Insertable {
    mutating func delete() -> ItemType? {
        return items.removeFirst()
    }
    
    mutating func insert(_ item: ItemType) {
        self.append(item: item)
    }
}

struct Stack<Element>: Popable {
    var items: [Element] = [Element]()

    func map<T>(transform: (Element) -> T) -> Stack<T> {
        var transformedStack: Stack<T> = Stack<T>()
        for item in items {
            transformedStack.items.append(transform(item))
        }
        return transformedStack
    }

    func filter(includeElement: (Element) -> Bool) -> Stack<Element> {
        var filteredStack: Stack<ItemType> = Stack<ItemType>()
        for item in items {
            if includeElement(item) {
                filteredStack.items.append(item)
            }
        }
        return filteredStack
    }

    func reduce<T>(_ initialResult: T, nextPartialResult: (T, Element) -> T) -> T {
        var result: T = initialResult
        for item in items {
            result = nextPartialResult(result, item)
        }
        return result
    }
}

struct Queue<Element>: Insertable {
    var items: [Element] = [Element]()
}
// 프로토콜 초기구현을 통해 기능을 구현한다면 프로토콜 채택만으로 타입에 기능을 추가해 사용할 수 있다.

var myIntStack: Stack<Int> = Stack<Int>()
myIntStack.push(1)
myIntStack.push(2)
myIntStack.push(3)
myIntStack.printSelf()

var myStrStack: Stack<String> = myIntStack.map{"\($0)"}
myStrStack.printSelf()

let filteredStack: Stack<Int> = myIntStack.filter{(item: Int) -> Bool in
    return item < 3
}

filteredStack.printSelf()

let combinedInt: Int = myIntStack.reduce(0) {(result: Int, next: Int) -> Int in
    return result + next
}

print(combinedInt)

let combinedDouble: Double = myIntStack.reduce(0.0) {(result: Double, next: Int) -> Double in
    return result + Double(next)
}

print(combinedDouble)