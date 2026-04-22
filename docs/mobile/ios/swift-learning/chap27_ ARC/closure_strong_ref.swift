// 클로저의 강한참조 순환 - 클로저가 인스턴스의 프로퍼티일 때 self로 값을 획득하면 강한참조 순환 발생
class Person {
    let name: String
    let hobby: String?

    lazy var introduce: () -> String = {
        var introduce: String = "My name is \(self.name)." // 지연 저장프로퍼티라서 self사용 가능.
        guard let hobby = self.hobby else {
            return introduce
        }
        introduce += " "
        introduce += "My hobby is \(hobby)"

        return introduce
    }

    init(name: String, hobby: String? = nil) {
        self.name = name
        self.hobby = hobby
    }

    deinit {
        print("\(name) is being deinitialized")
    }
}

var hyunjin: Person? = Person(name: "hyunjin", hobby: "game")
print(hyunjin?.introduce() as Any)
hyunjin = nil // 클로저가 self를 참조함으로써 참조횟수가 증가해 메모리에서 해제되지 않는다.

// 위의 문제를 획득목록(capture list)을 통해 해결할 수 있다.
// ==> 클로저 내부에서 참조 타입을 획득하는 규칙을 제시해줄 수 있는 기능
// 클로저 내부의 self 참조를 약한참조로 지정할 수 있다.
// 획득목록에 명시한 요소가 참조 타입이 아니라면 클로저가 생성될 때 초기화된다.
var a = 0
var b = 0
let closure = { [a] in
    print(a, b)
    b = 20
}

a = 10
b = 10
closure() // 0, 10
print(b) // 20
// 클로저 안의 변수 a는 획득목록을 통해 클로저가 생성될 때 클로저 외부의 변수 a의 값을 획득했다.(a라는 이름의 상수로 초기화된 것)
// ==> 이후 외부에서 a의 값을 변경하더라도 클로저의 획득 목록을 통한 a와는 별개가 된다.

class SimpleClass {
    var value: Int = 0
}

var x = SimpleClass()
var y = SimpleClass()

let closure2 = { [x] in
    print(x.value, y.value)
}
x.value = 10
y.value = 10
closure2() // 10 10 ==> 변수 x는 참조 타입의 인스턴스이기 때문에 따로 상수로 초기화되지 않음
// => 참조타입을 획득목록을 통해 얻을 때 강한 획득을 할 지, 약한 획득을 할 지, 미소유획득을 할 지 정해줄 수 있다.
// ==> 약한 획득을 하면 획득목록에서 획득하는 상수가 옵셔널 상수로 지정된다. 
// ==> 차후에 클로저에서 약한 획을으로 얻은 상수를 사용하려고 할 때 이미 메모리에서 해제된 상태일 수 있기 때문에

var x2: SimpleClass? = SimpleClass()
var y2 = SimpleClass()
let closure3 = { [weak x2, unowned y2] in
    print(x2?.value as Any, y2.value)
}
x2 = nil
y2.value = 10
closure3() // nil 10

class Person2 {
    let name: String
    let hobby: String?

    lazy var introduce: () -> String = { [unowned self] in // 클로저 강한 참조 문제 해결
        var introduce: String = "My name is \(self.name)."
        guard let hobby = self.hobby else {
            return introduce
        }
        introduce += " "
        introduce += "My hobby is \(hobby)"

        return introduce
    }

    init(name: String, hobby: String? = nil) {
        self.name = name
        self.hobby = hobby
    }

    deinit {
        print("\(name) is being deinitialized")
    }
}

var max: Person2? = Person2(name: "max", hobby: "racing")
print(max?.introduce() as Any)
max = nil // max is being deinitialized

/*
    self를 미소유참조로 지정해주었을 때 문제가 발생할 수 있다.
    프로퍼티로 사용하던 클로저를 다른 곳에서 참조하게 된 후 인스턴스가 사라져
    클로저를 실행시켰을 때 잘못된 메모리 접근을 하는 경우...
    그러므로 미소유참조는 신중히 사용해야 하며, 문제의 소지가 있다면 약한 참조를 사용하면 된다.
*/

// 획득목록의 미소유참조로 인한 차후 접근 문제 발생
var yagom: Person2? = Person2(name:"yagom", hobby:"eating")
var hana: Person2? = Person2(name:"hana", hobby:"playing guitar")

// hana의 프로퍼티에 yagom의 클로저 프로퍼티 참조 할당 
hana?.introduce = yagom?.introduce ?? {""}
print(yagom?.introduce() as Any)
yagom = nil
// print(hana?.introduce() as Any) // 오류발생! ==> 이런 경우 약한참조로 변경해 옵셔널로 사용해도 무방하다.
class Person3 {
    let name: String
    let hobby: String?

    lazy var introduce: () -> String = { [weak self] in // 클로저 강한 참조 문제 해결
        guard let `self` = self else {
            return "원래의 참조 인스턴스가 없어졌습니다."
        }

        var introduce: String = "My name is \(self.name)."

        guard let hobby = self.hobby else {
            return introduce
        }
        introduce += " "
        introduce += "My hobby is \(hobby)"

        return introduce
    }

    init(name: String, hobby: String? = nil) {
        self.name = name
        self.hobby = hobby
    }

    deinit {
        print("\(name) is being deinitialized")
    }
}

var iu: Person3? = Person3(name:"iu", hobby:"singing")
var hamilton: Person3? = Person3(name:"hamilton", hobby:"racing")

hamilton?.introduce = iu?.introduce ?? {""}
print(iu?.introduce() as Any)
iu = nil
print(hamilton?.introduce() as Any)