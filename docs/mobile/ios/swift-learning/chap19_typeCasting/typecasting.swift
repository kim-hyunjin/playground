/*
    스위프트에서는 다른 언어의 타입 변환을 이니셜라이저로 단순화함
    스위스트의 타입캐스팅은 인스턴스의 타입을 확인하거나 자신을 다른 타입의 인스턴스인양
    행세할 수 있는 방법으로 사용할 수 있다.
    is, as 연산자
    이 두 연산자로 타입을 확인하거나 캐스트할 수 있다.
*/
class Coffee {
    let name: String
    let shot: Int

    var description: String {
        return "\(shot) shot(s) \(name)"
    }

    init(shot: Int) {
        self.shot = shot
        self.name = "coffee"
    }
}

class Latte: Coffee {
    var flavor: String

    override var description: String {
        return "\(shot) shot(s) \(flavor) latte"
    }

    init(flavor: String, shot: Int) {
        self.flavor = flavor
        super.init(shot: shot)
    }
}

class Americano: Coffee {
    let iced: Bool

    override var description: String {
        return "\(shot) shot(s) \(iced ? "ice" : "hot") americano"
    }

    init(shot: Int, iced: Bool) {
        self.iced = iced
        super.init(shot: shot)
    }
}

let coffee: Coffee = Coffee(shot: 1)
print(coffee.description)

let americano: Americano = Americano(shot: 2, iced: false)
print(americano.description)

let latte: Latte = Latte(flavor: "green tea", shot: 3)
print(latte.description)

print(coffee is Coffee)
print(americano is Coffee)
print(latte is Coffee)

// 메타타입 .Type .Protocol
// self를 사용해 타입을 값처럼 표현하기 
protocol SomeProtocol {

}
class SomeClass: SomeProtocol {

}

let intType: Int.Type = Int.self
let classType: SomeClass.Type = SomeClass.self
let protocolType: SomeProtocol.Protocol = SomeProtocol.self

var someType: Any.Type
someType = intType
print(someType)
someType = classType
print(someType)
someType = protocolType
print(someType)

// type(of:)와 .self 사용
print(type(of: coffee) == Coffee.self)
print(type(of: americano) == Americano.self)
print(type(of: latte) == Latte.self)

// 다운캐스팅
let actingConstant: Coffee = Latte(flavor: "vanilla", shot: 2)
print(actingConstant.description)

// 타입캐스트 연산자 as? as!
if let actingOne: Americano = actingConstant as? Americano {
    print("This is Americano")
}

if let actingOne: Latte = actingConstant as? Latte {
    print("This is Latte")
}

if let actingOne: Coffee = actingConstant as? Coffee {
    print("This is coffee")
}

let castedCoffee: Coffee = americano as! Coffee

// 타입 캐스팅의 의미: 캐스팅은 실제로 인스턴스를 수정하거나 값을 변경하는 작업이 아니다.
// 인스턴스는 메모리에 똑같이 남아있고, 다만 인스턴스를 사용할 때 어떤 타입으로 다루어야 할지 컴퓨터에 힌트를 주는 것뿐이다.

// Any, AnyObject의 타입캐스팅
// Any는 모든 타입을 뜻하고,
// AnyObject는 클래스 타입만을 뜻한다.
func checkType(of item: AnyObject) {
    if item is Americano {
        print("item is americano")
    } else if item is Latte {
        print("item is latte")
    } else if item is Coffee {
        print("item is coffee")
    } else {
        print("item is unknown")
    }
}

checkType(of: coffee)
checkType(of: americano)
checkType(of: latte)

// 타입 판단 및 캐스팅 한번에 처리하기
func castTypeTo(item: AnyObject) {
    if let castedItem: Americano = item as? Americano {
        print(castedItem.description)
    } else if let castedItem: Latte = item as? Latte {
        print(castedItem.description)
    } else if let castedItem: Coffee = item as? Coffee {
        print(castedItem.description)
    } else {
        print("Unknown Type")
    }
}

castTypeTo(item: coffee)
castTypeTo(item: americano)
castTypeTo(item: latte)

func checkAnyType(of item: Any) {
    switch item {
    case 0 as Int:
        print("zero as an Int")
    case 0 as Double:
        print("zero as a Double")
    case let someInt as Int:
        print("an integer value of \(someInt)")
    case let someDouble as Double where someDouble > 0:
        print("a positive double value of \(someDouble)")
    case is Double:
        print("some other double value")
    case let someString as String:
        print("a string value of \"\(someString)\"")
    case let (x, y) as (Double, Double):
        print("an (x, y) point at \(x), \(y)")
    case let latte as Latte:
        print(latte.description)
    case let stringConverter as (String) -> String:
        print(stringConverter("hyunjin"))
    default:
        print("something else : \(type(of: item))")
    }
}

checkAnyType(of: 0)
checkAnyType(of: 0.0)
checkAnyType(of: 42)
checkAnyType(of: 3.1415)
checkAnyType(of: -0.25)
checkAnyType(of: "hello")
checkAnyType(of: (3.0, 5.0))
checkAnyType(of: latte)
checkAnyType(of: coffee)
checkAnyType(of: {(name: String) -> String in "Hello, \(name)"})