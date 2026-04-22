// 프로퍼티는 클래스, 구조체, 열거형 등에 관련된 값을 뜻한다.
// 메서드는 특정 타입에 관련된 함수를 뜻한다.

// 프로퍼티 종류
// - 저장 프로퍼티 : 인스턴스의 변수 또는 상수
// - 연산 프로퍼티 : 특정 연산을 실행한 결과값
// - 타입 프로퍼티
// 프로퍼티 감시자 : 프로퍼티의 값 변화에 따른 특정 작업을 실행, 저장 프로퍼티에 적용할 수 있으며 부모클래스로부터 상속받을 수 있다.

// 저장 프로퍼티
// var를 사용하면 변수, let을 사용하면 상수 저장 프로퍼티가 된다.
// 저장 프로퍼티를 정의할 때 기본값과 초기값을 지정해줄 수 있다.
// 구조체의 저장 프로퍼티는 옵셔널이 아니더라도 모두 포함해 이니셜라이저를 자동으로 생성한다.
// 하지만 클래스의 저장 프로퍼티는 옵셔널이 아니라면 프로퍼티 기본값을 지정해주거나 사용자 정의 이니셜라이저를 통해 반드시 초기화해주어야 한다.
// 클래스의 상수 프로퍼티는 초기화할때 한번만 값을 할당할 수 있으며, 자식클래스에서 변경(재정의)할 수 없다.

struct CordinatePoint {
    var x: Int
    var y: Int
}

// 기본적으로 저장 프로피티를 매개변수로 갖는 이니셜라이저가 있다.
let hyunjinPoint: CordinatePoint = CordinatePoint(x: 123, y: 345)

class Position {
    var point: CordinatePoint
    let name: String

    // 프로퍼티 기본값을 지정해주지 않는다면 이니셜라이저를 따로 정의해주어야한다.
    init(name: String, currentPoint: CordinatePoint) {
        self.name = name
        self.point = currentPoint
    }
}

let classPosition: Position = Position(name: "hyunjin", currentPoint: hyunjinPoint)

// 물론 초기값을 지정해주면 따로 이니셜라이저를 정의할 필요는 없다.
// 다만 의도와 맞지 않게 인스턴스가 사용될 가능성이 남아있고, 생성 후 값을 일일이 할당해야해서 불편하다.
// 인스턴스를 생성할 때 이니셜라이저를 통해 초기값을 보내야 하는 이유는 프로퍼티가 옵셔널이 아닌 값으로 선언되어 있기 때문이다.

class Position2 {
    // 현재 사람의 위치를 모를 수도 있다. - 옵셔널
    var point: CordinatePoint?
    let name: String

    init(name: String) {
        self.name = name
    }
}

let yagomPosition: Position2 = Position2(name: "yagom")
yagomPosition.point = CordinatePoint(x: 20, y: 10)
// 옵셔널과 이니셜라이저를 적절히 사용하면 다른 프로그래머가 사용할 때 내가 처음 의도한대로 사용할 수 있도록 유도할 수 있다.

// 지연 저장 프로퍼티
// 호출이 있어야 값을 초기화하며, lazy 키워드를 사용한다.
// 상수는 인스턴스가 완전히 생성되기 전에 초기화해야 하므로 필요할 때 값을 할당하는 지연 저장 프로퍼티와는 맞지 않다.
// 따라서 지연 저장 프로퍼티는 var 키워드를 사용해 정의한다.
// 지연 저장 프로퍼티는 주로 복잡한 클래스나 구조체를 구현할 때 많이 사용한다.
// -> 클래스의 인스턴의 저장 프로퍼티로 다른 클래스 인스턴스나 구조체 인스턴스를 할당해야 할 때
// 저장 프로퍼티로 쓰이는 인스턴스들이 한번에 생성되어야 한다면?
// 굳이 모든 저장 프로퍼티를 사용할 필요가 없다면? 지연 저장 프로퍼티를 사용하자.
// 불필요한 성능저하나 공간 낭비를 줄일 수 있다.
struct CordinatePoint2 {
    var x: Int = 0
    var y: Int = 0
}

class Position3 {
    lazy var point: CordinatePoint2 = CordinatePoint2()
    let name: String

    init(name: String) {
        self.name = name
    }
}

let jihyunPosition: Position3 = Position3(name: "jihyun")

// 아래에서 point 프로퍼티에 처음 접근할 때 CordinatePoint2가 생성된다.
print(jihyunPosition.point)

// 주의! 다중 스레드 환경에서 지연 저장 프로퍼티에 동시다발적으로 접근할 때는 여러번 초기화 될 수도 있다.

// 연산 프로퍼티 - 실제 값을 저장하는 프로퍼티가 아니라, 특정 상태에 따른 값을 연산하는 프로퍼티다.
// 인스턴스 내/외부의 값을 연산하여 적절한 값을 돌려주는 접근자(getter)의 역할이나
// 은닉화된 내부의 프로퍼티 값을 간접적으로 설정하는 설정자(setter)의 역할을 할 수도 있다.

// 굳이 메서드를 두고 연산 프로퍼티를 쓰는 이유?
// 인스턴스 외부에서 메서드를 통해 내부 값에 접근하려면 메서드를 두개(getter, setter) 구현해야 한다.
// 코드의 가독성이 나빠질 위험이 있다.
// 다만 연산 프로퍼티는 읽기 전용 상태로 구현하기는 쉽지만 쓰기 전용 상태로 구현할 수 없다는 단점이 있다.

struct CordinatePoint3 {
    var x: Int
    var y: Int

    // 접근자 메서드
    func oppositePoint() -> Self {
        return CordinatePoint3(x: -x, y: -y)
    }

    // 설정자 메서드
    mutating func setOppositePoint(_ opposite: CordinatePoint3) {
        x = -opposite.x
        y = -opposite.y
    }
}

var kimPosotion: CordinatePoint3 = CordinatePoint3(x: 10, y: 20)
print(kimPosotion)
print(kimPosotion.oppositePoint())
kimPosotion.setOppositePoint(CordinatePoint3(x: 15, y: 10))
print(kimPosotion)

// 위의 경우 설정자와 접근자의 이름이 일관성을 유지하기 힘들며, 코드를 한번에 읽기도 쉽지 않다.
// 하지만 연산 프로퍼티를 사용하면 더 간결하고 확실하게 표현할 수 있다.
struct CordinatePoint4 {
    var x: Int
    var y: Int

    var oppositePoint: CordinatePoint4 { // 연산 프로퍼티
        get {
            return CordinatePoint4(x: -x, y: -y) // return 키워드 생략가능
        }
        // set 메서드 내부에서 사용할 이름을 명시한 경우
        // set(opposite) {
        //     x = -opposite.x
        //     y = -opposite.y
        // }
        
        // 이름을 명시하는 대신 관용적으로 newValue라는 이름을 사용할 수 있다.
        set {
            x = -newValue.x
            y = -newValue.y
        }
    }
}

var hyesungPosition: CordinatePoint4 = CordinatePoint4(x: 10, y: 20)
print(hyesungPosition)
print(hyesungPosition.oppositePoint)
hyesungPosition.oppositePoint = CordinatePoint4(x: 15, y: 10)
print(hyesungPosition.oppositePoint)

// 프로퍼티 감시자
// 프로퍼티의 값이 변경되기 직전에 호출하는 willSet
// 값이 변경된 직후에 호출하는 didSet 메서드가 있다.
// willSet, didSet 에는 매개변수가 하나씩 있다. willSet 메서드에 전달되는 전달인자는 '변경될 값'이고
// didSet 메서드에 전달되는 전달인자는 '변경되기 전의 값'이다.
// 매개변수의 이름을 따로 지정하지 않으면 willSet에는 newValue가, didSet에는 oldValue가 자동 지정된다.

class Account {
    var credit: Int = 0 { // 프로퍼티 감시자
        willSet {
            print("잔액이 \(credit)원에서 \(newValue)원으로 변경될 예정입니다.")
        }
        didSet {
            print("잔액이 \(oldValue)원에서 \(credit)원으로 변경되었습니다.")
        }
    }

    var dollarValue: Double { // 연산프로퍼티
        get {
            Double(credit) /  1000.0
        }
        set {
            credit = Int(newValue * 1000)
            print("잔액을 \(newValue)달러로 변경 중")
        }
    }
}

let myAccount: Account = Account()
myAccount.credit = 1000

// 클래스를 상속받았다면 기존의 연산 프로퍼티를 재정의해 프로퍼티 감시자를 구현할 수도 있다.
// 재정의해도 기존 연산프로퍼티는 그대로 동작한다.
class ForeignAccount: Account {
    override var dollarValue: Double {
        willSet {
            print("잔액이 \(dollarValue)달러에서 \(newValue)달러로 변경될 예정입니다.")
        }
        didSet {
            print("잔액이 \(oldValue)달러에서 \(dollarValue)달러로 변경되었습니다.")
        }
    }
}

let myForeignAccount: ForeignAccount = ForeignAccount()
myForeignAccount.credit = 1000
myForeignAccount.dollarValue = 10

// 만약 프로퍼티 감시자가 있는 프로퍼티를 함수의 입출력 매개변수로 전달하면 willSet과 didSet이 호출된다.
// 함수 내에서 값 변경 여부와 상관없이 함수 종료시점에 항상 값을 다시 쓰기 때문이다.

// 전역 변수와 지역 변수
// 연산 프로퍼티와 프로퍼티 감시자는 전역변수와 지역변수 모두에 사용할 수 있다.
var wonInPocket: Int = 2000 {
    willSet {
        print("주머니 속 돈이 \(wonInPocket)원에서 \(newValue)원으로 바뀔 예정입니다.")
    }
    didSet {
        print("주머니의 돈이 \(oldValue)원에서 \(wonInPocket)원으로 변경되었습니다.")
    }
}

var dollarInPocket: Double {
    get {
        Double(wonInPocket) / 1000.0
    }
    set {
        wonInPocket = Int(newValue * 1000.0)
        print("주머니 속 달러를 \(newValue)달러로 변경중")
    }
}

// 타입 프로퍼티 - 타입 자체에 속하는 프로퍼티
// 인스턴스의 생성 여부와 상관없이 타입 프로퍼티의 값은 하나이며, 모든 인스턴스가 공통으로 사용하는 값.
// 타입 프로퍼티는 두 가지인데
// 저장 타입 프로퍼티는 변수 또는 상수로 선언할 수 있으머,
// 연산 타입 프로퍼티는 변수로만 선언할 수 있다.
// 저장 타입 프로퍼티는 반드시 초기값을 설정해야 하며, 지연 연산할 수 있다.
// 기본 지연 저장프로티와는 조금 다르게 다중 스레드 환경에서도 한 번만 초기화된다는 보장을 받는다.
// lazy 키워드로 표시해주지는 않는다.

class AClass {
    // 저장 타입 프로퍼티
    static var typeProperty: Int = 0

    // 저장 인스턴스 프로퍼티
    var instanceProperty: Int = 0 {
        didSet {
            Self.typeProperty = instanceProperty + 100
        }
    }

    // 연산 타입 프로퍼티
    static var typeComputeProperty: Int {
        get {
            return typeProperty
        }
        set {
            typeProperty = newValue
        }
    }
}

// 인스턴스를 생성하지 않고도 사용할 수 있다.
AClass.typeProperty = 123

let classInstance: AClass = AClass()
classInstance.instanceProperty = 100

print(AClass.typeProperty)
print(AClass.typeComputeProperty)

class AAccount {
    static let dollarExchangeRate: Double = 1000.0
    
    var credit: Int = 0

    var dollarValue: Double {
        get {
            return Double(credit) / Self.dollarExchangeRate
        }
        set {
            credit = Int(newValue * Self.dollarExchangeRate)
            print("잔액을 \(newValue)달러로 변경 중")
        }
    }
}

// 키 경로. 프로퍼티의 값을 바로 꺼내오는 것이 아니라 어떤 프로퍼티의 위치만 참조하도록 할 수 있다.
func someFn(paramA: Any, paramB: Any) {
    print("some function called...")
}
var someFnRef = someFn(paramA:paramB:)
someFnRef("A","B")

// 키 경로 타입은 AnyKeyPath라는 클래스로부터 파생된다.
// WritableKeyPath<Root, Value>와 ReferenceWritableKetPath<Root, Value>
// WritableKeyPath<Root, Value> 타입은 값 타입에 키 경로 타입으로 읽고 쓸 수 있는 경우에 적용되며
// ReferenceWritableKetPath<Root, Value> 타입은 참조 타입, 즉 클래스 타입에 키 경로 타입으로 읽고 쓸 수 있는 경우에 적용된다.
// 키 경로는 역슬래스(\)와 마침표(.) 경로로 구성된다.
// \타입이름.경로.경로.경로 - 여기서 경로는 프로퍼티 이름

class Person {
    var name: String
    
    init(name: String) {
        self.name = name
    }
}

struct Stuff {
    var name: String
    var owner: Person
}

print(type(of: \Person.name)) // ReferenceWritableKeyPath<Person, String>
print(type(of: \Stuff.name)) // WritableKeyPath<Stuff, String>

// 키 경로는 기존의 키 경로에 하위 경로를 덧붙여 줄 수도 있다.
let keyPath = \Stuff.owner
let nameKeyPath = keyPath.appending(path: \.name)

let hyunjin = Person(name: "hyunjin")
let hana = Person(name: "hana")
let macbook = Stuff(name: "macbook", owner: hyunjin)
var iMac = Stuff(name: "iMac", owner: hana)
let iPhone = Stuff(name: "iPhone", owner: hana)

let stuffNameKeyPath = \Stuff.name
let ownerKeyPath = \Stuff.owner
let ownerNameKeyPath = ownerKeyPath.appending(path: \.name)

// 키 경로와 서브스크립트를 이용해 프로퍼티에 접근하여 값을 가져온다.
print(macbook[keyPath: stuffNameKeyPath])
print(iMac[keyPath: stuffNameKeyPath])
print(iPhone[keyPath: stuffNameKeyPath])

print(macbook[keyPath: ownerNameKeyPath])
print(iMac[keyPath: ownerNameKeyPath])
print(iPhone[keyPath: ownerNameKeyPath])

iMac[keyPath: stuffNameKeyPath] = "iMac Pro"
iMac[keyPath: ownerKeyPath] = hyunjin

print(iMac[keyPath: stuffNameKeyPath])
print(iMac[keyPath: ownerNameKeyPath])

// 키 경로를 잘 활용하면 프로토콜과 마찬가지로 타입 간의 의존성을 낮추는 데 많은 도움을 줄 수 있다.
// 또, 애플의 프레임워크는 키-값 코딩 등 많은 곳에 키 경로를 활용하므로, 애플 프레임워크 기반 애플리케이션을 만든다면
// 알아두는 것이 많은 도움이 될 것이다.
// \.self 를 사용하면 인스턴스 그 자체를 표현하는 키 경로가 된다.