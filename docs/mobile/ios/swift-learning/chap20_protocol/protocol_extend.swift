protocol Readable {
    func read()
}

protocol Writable {
    func write()
}

protocol ReadSpeakable: Readable {
    func speak()
}

protocol ReadWriteSpeakable: Readable, Writable {
    func speak()
}

class SomeClass: ReadWriteSpeakable {
    func read() {
        print("Read")
    }

    func write() {
        print("Write")
    }

    func speak() {
        print("Speak")
    }
}

// 프로토콜의 상속 리스트에 class(deprecated), AnyObject 키워드를 추가해 프로토콜이 클래스 타입에만 채택될 수 있도록 제한할 수 있다.
protocol ClassOnlyProtocol: AnyObject, Readable, Writable {

}

class SomeClass2: ClassOnlyProtocol {
    func read() {}
    func write() {}
}

// 오류!!
// struct SomeStruct: ClassOnlyProtocol {
//     func read() {}
//     func write() {}
// }

// 프로토콜의 조합과 준수 확인
// 하나의 매개변수가 여러 프로토콜을 모두 준수하는 타입이어야 한다면
// 하나의 매개변수에 여러 프로토콜을 한번에 조합하여 요구할 수 있다.
// 또한 하나의 매개변수가 둘 이상의 프로토콜을 요구할 수도 있다.
protocol Named {
    var name: String {get}
}

protocol Aged {
    var age: Int {get}
}

struct Person: Named, Aged {
    var name: String
    var age: Int
}

class Car: Named {
    var name: String

    init(name: String) {
        self.name = name
    }
}

class Truck: Car, Aged {
    var age: Int

    init(name: String, age: Int) {
        self.age = age
        super.init(name: name)
    }
}

func celebrateBirthday(to celebrator: Named & Aged) {
    print("happy birthday \(celebrator.name)!! Now you are \(celebrator.age)")
}

let hyunjin: Person = Person(name: "hyunjin", age: 29)
celebrateBirthday(to: hyunjin)

let myCar: Car = Car(name: "morning")
// celebrateBirthday(to: myCar) // 오류! Aged를 충족시키지 못한다.

// var someVar: Car & Truck & Aged // 오류! 클래스 & 프로토콜 조합에서 클래스는 한 타입만 조합할 수 있다.

var someVar: Car & Aged
someVar = Truck(name: "Truck", age: 5)
celebrateBirthday(to: someVar)

// is, as 키워드를 사용해 프로토콜 준수 여부를 확인할 수 있다.
if let catedInstance: Named = hyunjin as? Named {
    print("\(catedInstance) is Named")
}

// 프로토콜의 선택적 요구
// 선택적 요구사항을 정의하고 싶은 프로토콜은 odjc 속성이 부여된 프로토콜이어야 한다.
// odjc 속성은 Objective-C 코드에서 사용할 수 있도록 만드는 역할은 한다.
// odjc 속성이 부여된 프로토콜은 Objective-C 클래스를 상속받은 클래스에서만 채택할 수 있다.
// odjc 속성을 사용하려면 애플의 Foundation 프레임워크 모듈을 임포트해야 한다.

// 선택적 요구사항은 optional 식별자를 붙여주면 된다.

import Foundation

@objc protocol Moveable {
    func walk()
    @objc optional func fly() // 선택적 요구사항
}

// @objc 속성을 사용하기 위해 Objective-C의 NSObject 상속
class Tiger: NSObject, Moveable {
    func walk() {
        print("Tiger walks")
    }
}

class Bird: NSObject, Moveable {
    func walk() {
        print("Bird walks")
    }

    func fly() {
        print("Bird flys")
    }
}

let tiger: Tiger = Tiger()
let bird: Bird = Bird()

tiger.walk()
bird.walk()
bird.fly()
var moveableInstance: Moveable = tiger
moveableInstance.fly?() // 응답없음
moveableInstance = bird
moveableInstance.fly?()

// 프로토콜의 변수와 상수
// 프로토콜 이름을 타입으로 갖는 변수 또는 상수에는 그 프로토콜을 준수하는 타입의 어떤 인스턴스라도 할당할 수 있다.

/*
    위임을 위한 프로토콜
    위임은 클래스나 구조체가 자신의 책임이나 임무를 다른 타입의 인스턴스에게 위임하는 디자인 패턴이다.
    책무를 위임하기 위해 정의한 프로토콜을 준수하는 타입은 자신에게 위임될 일정 책무를 해낼 수 있음을 보장한다.

    위임 패턴은 애플의 프레임워크에서 사용하는 주요한 패턴 중 하나다.
    다양한 프로토콜이 ~Delegate 식의 이름으로 정의되어 있다.
    예를 들어, UITableView 타입의 인스턴스가 해야하는 일을 위임받아 처리하는 인스턴스는
    UITableViewDelegate 프로토콜을 준수하면 된다.
*/