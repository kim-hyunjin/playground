/*
    참조 타입은 하나의 인스턴스가 참조를 통해 여러 곳에서 접근하기 때문에 언제 메모리에서 해제되는지 중요하다.
    적절한 시점에 메모리에서 해제되지 않으면 한정적인 메모리 자원을 낭비하게 되어 성능의 저하로 이어진다.
    스위프트는 프로그램 메모리 사용을 관리하기 위해 메모리 관리 기법은 ARC를 사용한다.

    ARC(Automatic Reference Counting)가 관리해주는 참조 횟수 계산은 클래스의 인스턴스에만 적용된다.

    가비지 컬렉션과의 차이
    가장 큰 차이는 참조를 계산하는 시점
    ARC는 인스턴스가 언제 메모리에서 해제되어야 할지를 컴파일과 동시에 결정

    메모리 감시를 위한 추가 자원이 필요없다.
    규칙을 모르고 사용하면 인스턴스가 메모리에서 영원히 해제되지 않을 가능성이 있다.
    우리가 원하는 방향으로 메모리 관리가 이루어지려면 ARC에 명확한 힌트를 주어야 한다.

    클래스의 인스턴스를 생성할 때마다 ARC는 그 인스턴스에 대한 정보를 저장하기 위한 메모리 공간을 따로 할당한다.
    그 공간에 인스턴스의 타입 정보와 관련된 저장 프로퍼티 값 등을 저장한다.
    그 후에 인스턴스가 더 이상 필요없는 상태가 되면 ARC가 메모리에서 인스턴스를 없앤다.
*/

// 강한 참조
// 인스턴스를 다른 인스턴스의 프로퍼티나 변수, 상수 등에 할당할 때 강한참조를 사용하면 참조 횟수가 1 증가한다.
// 강한참조에 nil을 할당하면 원래 1 감소한다.
class Person {
    let name: String

    init(name: String) {
        self.name = name
        print("\(name) is being initialized")
    }

    deinit {
        print("\(name) is being deinitialized")
    }
}
var ref1: Person?
var ref2: Person?
var ref3: Person?

ref1 = Person(name: "hj") // is being initialized

ref2 = ref1
ref3 = ref1

ref3 = nil
ref2 = nil
ref1 = nil // is being deinitialized

func foo() {
    let hyunjin: Person = Person(name: "hyunjin") // hyunjin is being initialized
    print(hyunjin)
    // 함수 종료 시점에 is being deinitialized
}
foo()

var globalRef: Person?

func foo2() {
    let hyunjin: Person = Person(name: "hyunjin") // 참조횟수 1
    globalRef = hyunjin // 참조횟수 2
    // 함수 종료 : 참조횟수 1
}
foo2()
// 함수가 종료되어도 여전히 참조횟수가 1이므로 메모리에서 해제되지 않는다.

// 강한 참조 순환 문제

    class Person2 {
        let name: String

        init(name: String) {
            self.name = name
        }

        var room: Room?

        deinit {
            print("\(name) is being deinitialized")
        }
    }

    class Room {
        let number: String

        init(number: String) {
            self.number = number
        }

        var host: Person2?

        
        deinit {
            print("Room \(number) is being deinitialized")
        }
    }

    var iu: Person2? = Person2(name: "iu") // 참조 1
    var room: Room? = Room(number: "505") // 참조 1

    // 순환 참조
    room?.host = iu // 참조 2
    iu?.room = room // 참조 2

    iu = nil // 참조 1
    room = nil // 참조 1
    // ==> 메모리 누수

// 해결책 약한 참조와 미소유 참조

// 약한 참조 - 자신이 참조하는 인스턴스의 참조 횟수를 증가시키지 않는다. weak 키워드 사용
// 약한 참조를 사용한다면 자신이 참조하는 인스턴스가 메모리에서 해제될 수도 있다는 것을 예상할 수 있어야 한다.
// 옵셔널 변수만 약한참조를 할 수 있다.(nil이 할당될 수 있어야 하기 때문)
class Driver {
        let name: String

        init(name: String) {
            self.name = name
        }

        var room: Hotel?

        deinit {
            print("\(name) is being deinitialized")
        }
    }

class Hotel {
    let number: String
    init (number: String) {
        self.number = number
    }

    weak var host: Driver?

    deinit {
        print("Hotel \(number) is being deinitialized")
    }
}

var ferez: Driver? = Driver(name:"ferez") // 참조 1
var hotel: Hotel? = Hotel(number: "505") // 참조 1

hotel?.host = ferez // 참조 1
ferez?.room = hotel // 참조 2

ferez = nil // Driver 참조 0, Hotel 참조 1
hotel = nil // 참조 0

// 미소유참조
// 약한 참조와 다르게 자신이 참조하는 인스턴스가 항상 메모리에 존재할 것이라는 전제를 기반으로 동작한다.
// => 스스로 nil을 할당하지 않음 ==> 옵셔널 변수가 아니어도 된다
// 대신 메모리에서 해제된 인스턴스에 접근하려하면 런타임 오류 발생
// unowned 키워드 사용

class CardOwner {
    let name: String

    var card: CreditCard?

    init(name: String) {
        self.name = name
    }

    deinit {
        print("\(name) is being deinit")
    }    
}

class CreditCard {
    let number: UInt
    unowned let owner: CardOwner

    init(number: UInt, owner: CardOwner) {
        self.number = number
        self.owner = owner
    }

    
    deinit {
        print("Card \(number) is being deinit")
    }
}

var jisoo: CardOwner? = CardOwner(name: "jisoo") // 참조 1

if let owner: CardOwner = jisoo {
    owner.card = CreditCard(number: 2389732, owner: owner) // jisoo의 참조가 늘어나지 않음, 카드의 참조횟수 1
}

jisoo = nil // 카드와 주인 모두 참조 0

// 미소유참조와 암시적 추출 옵셔널 프로퍼티
// 서로 참조해야 하는 프로퍼티에 값이 꼭 있어야 하면서도 한번 초기화된 후 nil을 할당할 수 없는 조건을 갖추어야 한다면?
class Company {
    let name: String
    // 암시적 추출 옵셔널 프로퍼티(강한참조)
    var ceo: CEO!

    init(name: String, ceoName: String) {
        self.name = name
        self.ceo = CEO(name: ceoName, company: self)
    }

    func introduce() {
        print("\(name)의 CEO는 \(ceo.name)입니다.")
    }
}

class CEO {
    let name: String
    // 미소유참조 상수 프로퍼티 (미소유참조)
    unowned let company: Company

    init(name: String, company: Company) {
        self.name = name
        self.company = company
    }

    func introduce() {
        print("\(name)는 \(company.name)의 CEO입니다.")
    }
}

let company: Company = Company(name: "무한상사", ceoName: "김태호")
company.introduce()
company.ceo.introduce()
// print(company.ceo.company.ceo as Any)
// print(company.ceo.company.ceo.company.ceo.company.ceo as Any)
