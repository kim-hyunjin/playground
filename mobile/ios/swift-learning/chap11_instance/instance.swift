/*
    인스턴스 생성
    이니셜라이저를 정의하면 초기화 과정을 직접 구현할 수 있다.
    이니셜라이저는 새로운 인스턴스를 생성할 수 있는 특별한 메서드가 된다.
    이니셜라이저는 반환값이 없다.

    이니셜라이저를 통해 초기값을 할당하거나, 프로퍼티 기본값을 통해 저장 프로퍼티가 초기화 될 때는
    프로퍼티 감시자가 호출되지 않는다.

    초기화 과정에서 값을 지정해주기 어려운 경우 저장 프로퍼티를 옵셔널로 선언할 수 있다.
    옵셔널로 선언한 저장 프로퍼티는 초기화 과정에서 값을 할당해주지 않는다면 자동으로 nil이 할당된다.

    상수로 선언한 저장 프로퍼티는 초기화 과정에서만 값을 할당할 수 있다.

    기본 이니셜라이저는 저장 프로퍼티의 기본값이 모두 지정되어 있고
    동시에 사용자 정의 이니셜라이저가 정의되어 있지 않은 상태에서 제공된다.

    그러나 프로퍼티 하나 때문에 배번 이니셜라이저를 변경하는 일은 여간 귀찮은 일이 아니다.
    때문에 구조체는 사용자 정의 이니셜라이저를 구현하지 않으면 프로퍼티의 이름으로 매개변수를 갖는 이니셜라이저인
    멤버와이즈 이니셜라이저를 기본으로 제공한다.
    클래스는 멤버와이즈 이니셜라이저를 지원하지 않는다.
*/
struct Point {
    var x: Double = 0.0
    var y: Double = 0.0
}

struct Size {
    var width: Double = 0.0
    var height: Double = 0.0
}

let point: Point = Point(x: 0, y: 0)
let size: Size = Size(width: 50.0, height: 50.0)

// 구조체의 저장 프로퍼티에 기본값이 있는 경우 필요한 매개변수만 사용하여 초기화 할 수도 있다.
// - 구조체의 특권
let somePoint: Point = Point()
let someSize: Size = Size(width: 50.0)
let anotherPoint: Point = Point(y: 100)

// 초기화 위임
// 구조체와 열거형은 이니셜라이저가 다른 이니셜라이저에게 일부 초기화를 위임할 수 있다.
// 하지만 클래스는 상속을 지원하는 터라 간단한 초기화 위임도 할 수 없다.
// 값 타입에서 이니셜라이저가 다른 아니셜라이저를 호출하려면 self.init을 사용하면 된다.
// 사용자 정의 이니셜라이저를 정의할 때도 기본 이니셜라이저나 멤버와이즈 이니셜라이저를 사용하고 싶다면 익스텐션을 이용해 사용자 정의 이니셜라이저를 정의하면 된다.

enum Student: String {
    case elementary = "초등학생", middle = "중학생", high = "고등학생"
    case none
    
    init() {
        self = .none
    }

    init(koreanAge: Int) {
        switch koreanAge {
            case 8...13:
                self = .elementary
            case 14...16:
                self = .middle
            case 17...19:
                self = .high
            default:
                self = .none
        }
    }

    init(bornAt: Int, currentYear: Int) {
        self.init(koreanAge: currentYear - bornAt + 1)
    }
}

var younger: Student = Student(koreanAge: 16)
print(younger)
younger = Student(bornAt: 2010, currentYear: 2021)
print(younger)

// 실패 가능한 이니셜라이저
// 이니셜라이저의 전달인자로 잘못된 값이나 적절치 못한 값이 전달되었을 때 이니셜라이저는 인스턴스 초기화에 실패할 수 있다.
// 이런 실패 가능성을 내포한 이니셜라이저를 실패 가능한 이니셜라이저라고 부른다.
// 살패 가능한 이니셜라이저는 실패했을 때 nil을 반환해주므로 반환 타입이 옵셔널로 지정된다. 따라서 init 대신 init? 키워드를 사용한다.
// 실패하지 않는 이니셜라이저와 실패 가능한 이니셜라이저가 같은 매개변수 타입을 갖도록 정의할 수 없다.
class Person {
    let name: String
    var age: Int?

    init?(name: String) {
        if name.isEmpty {
            return nil
        }
        self.name = name
    }

    init?(name: String, age: Int) {
        if name.isEmpty || age < 0 {
            return nil
        }
        self.name = name
        self.age = age
    }
}
let hj: Person? = Person(name:"hyunjin", age: 29)
if let person: Person = hj {
    print(person.name)
} else {
    print("Person wasn't initialized")
}

let max: Person? = Person(name:"max", age:-1)
if let person: Person = max {
    print(person.name)
} else {
    print("Person wasn't initialized")
}

// 실패 가능한 이니셜라이저는 구조체와 클래스에서도 유용하지만 특히 열거형에서 유용하다.
// rawValue를 통한 이니셜라이저는 기본으로 실패 가능한 이니셜라이저로 제공된다.
var baby: Student? = Student(rawValue: "아기")
print(baby as Any) // nil

// 함수를 사용한 프로퍼티 기본값 설정
// 클로저 사용하기
struct Student2 {
    var name: String?
    var number: Int?
}

class SchoolClass {
    var students: [Student2] = {
        // 새로운 인스턴스를 생성하고 사용자 정의 연산 후 반환
        var arr: [Student2] = [Student2]()
        for num in 1...15 {
            var student: Student2 = Student2(name: nil, number: num)
            arr.append(student)
        }
        return arr
    }()
}

let myClass: SchoolClass = SchoolClass()
print(myClass.students.count)
// iOS의 UI등을 구성할 때, UI컴포넌트를 클래스의 프로퍼티로 구현하고, UI컴포넌트 생성과 동시에 기본설정을 할 때 유용하게 사용할 수 있다.

// 인스턴스 소멸
// 디이니셜라이저는 클래스의 인스턴스에서만 구현할 수 있습니다.
// 스위프트는 인스턴스가 더 이상 필요하지 않으면 자동으로 메모리에서 소멸시킵니다.
// 그렇지만 파일을 불러와 열어보는 등 외부 자원을 사용했다면 인스턴스를 소멸하기 직전에 파일을 저장하고 닫아주는 등의 부가 작업을 해야 할 때 쓸 수 있다.
class SomeClass {
    deinit {
        print("인스턴스 디이니셜라이즈")
    }
}

var instance: SomeClass? = SomeClass()
instance = nil // instance will be deallocated immediately

class FileManager {
    var fileName: String

    init(fileName: String) {
        self.fileName = fileName
    }

    func openFile() {
        print("Open file: \(self.fileName)")
    }
    func modifyFile() {
        print("Modify file: \(self.fileName)")
    }
    func writeFile() {
        print("Write file: \(self.fileName)")
    }
    func closeFile() {
        print("Close file: \(self.fileName)")
    }

    deinit {
        print("Deinit instance")
        self.writeFile()
        self.closeFile()
    }
}

var fileManager: FileManager? = FileManager(fileName: "test.txt")
if let manager: FileManager = fileManager {
    manager.openFile()
    manager.modifyFile()
}
fileManager = nil