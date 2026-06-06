/*

    클래스의 이니셜라이저 - 상속과 재정의
    지정(Designated) 이니셜라이저와 편의 이니셜라이저

    지정이니셜라이저는 필요에 따라 부모의 이니셜라이저를 호출할 수 있으며,
    이니셜라이저가 정의된 클래스의 모든 프로퍼티를 초기화해야하는 임무를 갖고 있다.
    모든 클래스는 하나 이상의 지정 이니셜라이저를 갖는다.
    만약 조상클래스에서 자손클래스의 지정 이니셜라이저 역할을 충분히 할 수 있다면, 자손클래스는 지정 이니셜라이저를 가지지 않을 수 있다.
    init(args...) {

    }

    편의(Convenience) 이니셜라이저는 초기화를 좀 더 손쉽게 도와주는 역할을 한다.
    편의 이니셜라이저는 지정 이니셜라이저를 자신 내부에서 호출한다.
    지정 이니셜라이저의 매개변수가 많아 외부에서 일일이 전달인자를 전달하기 어려울 때나 특별한 목적에 사용하기 위해 편의 이니셜라이저를 설계할 수 있다.
    convenience init(args...) {
    }
*/

/*
    클래스의 초기화 위임
    1. 자식 클래스의 지정 이니셜라이저는 부모클래스의 지정 이니셜라이저를 반드시 호출해야 한다.
    2. 편의 이니셜라이저는 다른 이니셜라이저를 반드시 호출해야 한다.
    3. 편의 이니셜라이저는 궁극적으로는 지정 이니셜라이저를 반드시 호출해야 한다.
    ==> '누군가'는 반드시 지정 이니셜라이저에게 초기화를 위임한다.

    2단계 초기화
    1단계는 클래스에 정의한 각각의 저장 프로퍼티에 초깃값을 할당한다.
    2단계에서는 저장 프로퍼티들을 사용자 정의할 기회를 얻는다.
    2단계 초기화는 프로퍼티를 초기화하기 전에 프로퍼티 값에 접근하는 것을 막아 초기화를 안전하게 할 수 있도록 한다.
    다른 이니셜라이저가 프로퍼티의 값을 실수로 변경하는 것을 방지 할 수 있다.

    스위프트 컴파일러는 2단계 초기화를 오류없이 처리하기 위해 네가지 안전확인(Safty-checks)을 실행한다.
    1. 자식클래스의 지정 이니셜라이저가 부모클래스의 이니셜라이저를 호출하기 전에 자신의 프로퍼티를 모두 초기화 했는지 확인한다.
    2. 자식클래스의 지정 이니셜라이저는 상속받은 프로퍼티에 값을 할당하기 전에 반드시 부모클래스의 이니셜라이저를 호출해야 한다.
    3. 편의 이니셜라이저는 자신의 클래스에 정의한 프로퍼티를 포함해 그 어떤 프로퍼티에라도 값을 할당하기 전에 다른 이니셜라이저를 호출해야 한다.
    4. 초기화 1단계를 마치기 전까지는 이니셜라이저는 인스턴스 메서드를 호출할 수 없다. 인스턴스 프로퍼티의 값을 읽을 수도, self 프로퍼티를 활용할 수도 없다.

    1단계
    클래스가 이니셜라이저 호출 -> 인스턴스를 위한 메모리 할당 -> 프로퍼티 값 확인 -> 부모클래스의 이니셜라이저에 초기화 양도 -> 상속 체인을 따라 반복
    2단계
    최상위에서 상속 체인을 따라 내려오며 인스턴스를 제각각 사용자 정의(self 사용, 인스턴스 메서드 호출)
*/
class Person {
    var name: String
    var age: Int

    init(name: String, age: Int) {
        self.name = name
        self.age = age
    }

    convenience init(name: String) {
        self.init(name: name, age: 0)
    }
}

class Student: Person {
    var major: String

    init(name: String, age: Int, major: String) {
        self.major = "Swift"
        super.init(name: name, age: age)
    }

    convenience init(name: String) {
        self.init(name: name, age: 7, major: "")
    }
}


// 이니셜라이저 상속 및 재정의
class Student2: Person {
    var major: String

    override init(name: String, age: Int) {
        self.major = "Swift"
        super.init(name: name, age:age)
    }

    convenience init(name: String) {
        self.init(name: name, age: 7)
    }
}

class Person2 {
    var name: String
    var age: Int

    init() {
        self.name = "Unknown"
        self.age = 0
    }

    // 실패 가능한 이니셜라이저
    init?(name: String, age: Int) {
        if name.isEmpty {
            return nil
        }
        self.name = name
        self.age = age
    }

    init?(age: Int) {
        if age < 0 {
            return nil
        }
        self.name = "Unknown"
        self.age = age
    }
}

class Student3: Person2 {
    var major: String
    // 자식에서 부모의 실패 가능한 이니셜라이저를 똑같이 실패 가능한 이니셜라이저로 재정의 할 수도, 그렇지 않을 수도 있다.
    override init?(name: String, age: Int) {
        self.major = "Swift"
        super.init(name: name, age: age)
    }

    override init(age: Int) {
        self.major = "Swift"
        super.init()
    }
}

// 이니셜라이저 자동 상속
// 1. 자식 클래스에서 별도의 지정 이니셜라이저를 구현하지 않는다면, 부모의 지정 이니셜라이저가 자동 상속된다.
// 2. 1.에 따라 자동으로 상속받은 경우 또는 부모클래스의 지정 이니셜라이저를 모두 재정의해 부모클래스와 동일한 지정 이니셜라이저를 모두 사용할 수 있는 상황이라면
//    부모 클래스의 편의 이니셜라이저가 모두 자동 상속된다.

class Person3 {
    var name: String

    init(name: String) {
        self.name = name
    }

    convenience init() {
        self.init(name: "Unknown")
    }
}

// 부모 클래스의 편의 이니셜라이저 자동 상속됨
class Student4: Person3 {
    var major: String = "Swift"
}

let hyunjin: Person3 = Person3(name: "hyunjin")
let hana: Student4 = Student4(name: "hana")
print(hyunjin.name)
print(hana.name)

let max: Person3 = Person3()
let ferez: Student4 = Student4()
print(max.name) // Unknown
print(ferez.name) // Unknown

class Student5: Person3 {
    var major: String

    // 부모 클래스의 지정 이니셜라이저 재정의
    override init(name: String) {
        self.major = "Unknown"
        super.init(name: name)
    }

    init(name: String, major: String) {
        self.major = major
        super.init(name: name)
    }
}

let jiwoo: Student5 = Student5()
print(jiwoo.name) // Unknown


// 자동 상속 규칙은 자식클래스에서 편의 이니셜라이저를 추가하더라도 유효하다.
class Student6: Person3 {
    var major: String

    init(name: String, major: String) {
        self.major = major
        super.init(name: name)
    }

    convenience init(major: String) {
        self.init()
        self.major = major
    }

    override convenience init(name: String) {
        self.init(name: name, major: "Unknown")
    }
}

let jihyun: Student6 = Student6(major: "Swift")
print(jihyun.name)
print(jihyun.major)

// 상속 받은 이니셜라이저와 자신의 편의 이니셜라이저들을 모두 사용할 수 있다.
class UniversityStudent2: Student6 {
    var grade: String = "A+"
    var description: String {
        return "\(self.name) \(self.major) \(self.grade)"
    }

    convenience init(name: String, major: String, grade: String) {
        self.init(name: name, major: major) // 상속받은 이니셜라이저
        self.grade = grade
    }
}
let nova: UniversityStudent2 = UniversityStudent2()
print(nova.description) // Unknown Unknown A+

let raon: UniversityStudent2 = UniversityStudent2(name: "raon")
print(raon.description) // raon Unknown A+

let joker: UniversityStudent2 = UniversityStudent2(name: "joker", major: "Comedy")
print(joker.description) // joker Comedy A+

let chope: UniversityStudent2 = UniversityStudent2(name: "chope", major:"Computer", grade: "C")
print(chope.description) // chope Computer C

// 요구 이니셜라이저 : required 수식어 사용
// 자식클래스에서 반드시 해당 이니셜라이저를 구현해주어야 한다.(재정의)
// 자식클래스에서 재정의할때는 override 수식어 대신 required 수식어를 사용한다.
class Person4 {
    var name: String

    // 요구 이니셜라이저 정의
    required init() {
        self.name = "Unknown"
    }
}

// 부모의 이니셜라이저 자동 상속(요구 이니셜라이저 구현안해도 됨)
class Student7: Person4 {
    var major: String = "Unknown"
}

class Student8: Person4 {
    var major: String = "Unknown"

    // 자신의 지정 이니셜라이저 구현 ==> 부모의 이니셜라이저를 자동 상속받지 못한다.
    init(major: String) {
        self.major = major
        super.init()
    }
    // 그래서 Person4에서 정의한 요구 이니셜라이저를 구현해주어야 한다.
    required init() {
        self.major = "Unknown"
        super.init()
    }
}

class UniversityStudent3: Student8 {
    var grade: String

    // 자신의 지정 이니셜라이져 구현
    init(grade: String) {
        self.grade = grade
        super.init()
    }

    required init() {
        self.grade = "F"
        super.init()
    }
}

let jisoo: Student8 = Student8()
print(jisoo.major)

let yagom: Student8 = Student8(major:"Swift")
print(yagom.major)

let hyesung: UniversityStudent3 = UniversityStudent3(grade: "A+")
print(hyesung.grade)

// 부모클래스의 이니셜라이저를 재정의함과 동시에 요구 이니셜라이저로 변경할 수도 있다.
class Person5 {
    var name: String

    init() {
        self.name = "Unknown"
    }
}

class Student9: Person5 {
    var major: String = "Unknown"

    init(major: String) {
        self.major = major
        super.init()
    }

    // Person5의 이니셜라이저를 요구 이니셜라이저로 변경
    required override init() {
        self.major = "Unknown"
        super.init()
    }

    required convenience init(name: String) {
        self.init()
        self.name = name
    }
}

class UniversityStudent4: Student9 {
    var grade: String

    init(grade: String) {
        self.grade = grade
        super.init()
    }

    // Student9에서 요구했으므로 구현해주어야 한다.
    required init() {
        self.grade = "F"
        super.init()
    }

    required convenience init(name: String) {
        self.init()
        self.name = name
    }
}

let us4: UniversityStudent4 = UniversityStudent4()
print(us4.grade)

let iu: UniversityStudent4 = UniversityStudent4(name: "IU")
print(iu.name)