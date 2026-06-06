/*
    프로토콜은 특정 역할을 하기 위한 메서드, 프로퍼티, 기타 요구사항 등의 청사진을 정의한다.
    프로토콜은 스스로 기능을 구현하지는 않는다.

    프로토콜은 자신을 채택한 타입이 어떤 프로퍼티를 구현해야 하는지 요구할 수 있다.
    프로퍼티의 이름과 타입만 맞도록 구현해주면 된다.
    다만 프로퍼티를 읽기 전용으로 할지 말지 프로토콜이 정한다.

    프로토콜의 프로퍼티 요구사항은 var 키워드를 사용한 변수로 정의한다.
    읽고 쓰기가 모두 가능한 경우 {get set}이라고 명시하며,
    읽기 전용은 {get}으로 명시한다.
*/

protocol SomeProtocol {
    var settableProp: String {get set}
    var getOnlyProp: String {get}
}

protocol AnotherProtocol {
    // 타입 프로퍼티
    static var someTypeProp: Int {get set}
    static var anotherTypeProp: Int {get}
}

protocol Sendable {
    var from: String {get}
    var to: String {get}
}

class Message: Sendable {
    var sender: String
    var from: String {
        return self.sender
    }

    var to: String

    init(sender: String, receiver: String) {
        self.sender = sender
        self.to = receiver
    }
}

// 프로토콜에서 읽기 가능한 프로퍼티를 채택할 때 읽고쓰기가 가능한 프로퍼티로 구현해도 문제 없다.
class Mail: Sendable {
    var from: String
    var to: String

    init(sender: String, receiver: String) {
        self.from = sender
        self.to = receiver
    }
}

// 메서드 요구
// {} 부분은 제외하고 메서드의 이름, 매개변수, 반환타입 등만 작성한다.
protocol Receiveable {
    func received(data: Any, from: Sendable2)
}

protocol Sendable2 {
    var from: Sendable2 {get}
    var to: Receiveable? {get}

    func send(data: Any)

    static func isSendableInstance(_ instance: Any) -> Bool
}

class Message2: Sendable2, Receiveable {
    var from: Sendable2 {
        return self
    }

    var to: Receiveable?

    func send(data: Any) {
        guard let receiver: Receiveable = self.to else {
            print("Message has no receiver")
            return
        }
        receiver.received(data: data, from: self.from)
    }

    func received(data: Any, from: Sendable2) {
        print("Message received \(data) from \(from)")
    }

    // 프로토콜에는 static 키워드로 타입메서드를 요구했지만 class로 구현할 수 있다.
    class func isSendableInstance(_ instance: Any) -> Bool {
        if let sendableInstance: Sendable2 = instance as? Sendable2 {
            return sendableInstance.to != nil
        }
        return false
    }
}

class Mail2: Sendable2, Receiveable {
    var from: Sendable2 {
        return self
    }

    var to: Receiveable?

    func send(data: Any) {
        guard let receiver: Receiveable = self.to else {
            print("Mail has no receiver")
            return
        }
        receiver.received(data: data, from: self.from)
    }

    func received(data: Any, from: Sendable2) {
        print("Mail received \(data) from \(from)")
    }

    static func isSendableInstance(_ instance: Any) -> Bool {
        if let sendableInstance: Sendable2 = instance as? Sendable2 {
            return sendableInstance.to != nil
        }
        return false
    } 
}

let myPhoneMessage: Message2 = Message2()
let yourPhoneMessage: Message2 = Message2()

myPhoneMessage.to = yourPhoneMessage
myPhoneMessage.send(data: "Hello")

let myMail: Mail2 = Mail2()
let yourMail: Mail2 = Mail2()

myMail.to = yourMail
myMail.send(data: "Hi")

myMail.to = myPhoneMessage
myMail.send(data: "awesome")

print(Message2.isSendableInstance(myPhoneMessage))
print(Message2.isSendableInstance(yourPhoneMessage))
print(Mail2.isSendableInstance(myPhoneMessage))
print(Mail2.isSendableInstance(myMail))

// 가변 메서드 요구
protocol Resettable {
    mutating func reset()
}

class Person: Resettable {
    var name: String?
    var age: Int?

    // 클래스에서는 mutating 키워드 생략가능
    func reset() {
        self.name = nil
        self.age = nil
    }
}

struct Point: Resettable {
    var x: Int = 0
    var y: Int = 0

    mutating func reset() {
        self.x = 0
        self.y = 0
    }
}

enum Direction: Resettable {
    case east, west, south, north, unknown

    mutating func reset() {
        self = Direction.unknown
    }
}

// 이니셜라이저 요구
protocol Named {
    var name: String {get}
    init(name: String)
}

struct Pet: Named {
    var name: String

    init(name: String) {
        self.name = name
    }
}

class Person2: Named {
    var name: String

    // 클래스의 경우 이니셜라이저 요구에 따라 구현할 때는 required 식별자를 붙여야 한다.
    // ==> 상속받은 클래스들도 프로토콜을 준수해야 하기 때문
    required init(name: String) {
        self.name = name
    }
}

// 클래스 자체가 상속받을 수 없는 final 클래스라면 required 생략 가능
final class Person3: Named {
    var name: String

    init(name: String) {
        self.name = name
    }
}

// 실패 가능한 이니셜라이저 요구
// => 실패 가능한 이니셜라이저, 일반적인 이니셜라이저로 구현해도 상관없다.
protocol Named2 {
    var name: String {get}

    init?(name: String)
}

struct Animal: Named2 {
    var name: String
    
    init!(name: String) {
        self.name = name
    }
}

struct Pet2: Named2 {
    var name: String

    init(name: String) {
        self.name = name
    }
}

class Pet3: Named2 {
    var name: String

    required init?(name: String) {
        self.name = name
    }
}