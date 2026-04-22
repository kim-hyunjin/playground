// 스위프트의 클래스는 부모클래스로부터 물려받은 메서드를 호출할 수 있고 프로퍼티에 접근할 수 있으며 서브스크립트도 사용할 수 있다.
// 또, 부모클래스로부터 물려받은 메서드, 프로퍼티, 서브스크립트 등을 자신만의 내용으로 재정의할 수 있다.
// 연산 프로퍼티에 프로퍼티 감시자를 구현할 수 없지만, 자식클래스에서 부모클래스의 연산프로퍼티든 저장프로퍼티든 상관없이 프로퍼티 감시자를 구현할 수 있다.
// 다른 클래스로부터 상속을 받지 않은 클래스를 기반 클래스(base class)라고 부른다.
class Person {
    var name: String = ""
    var age: Int = 0
    var koreanAge: Int {
        return self.age + 1
    }
    var fullName: String {
        get {
            return self.name
        }
        set {
            self.name = newValue
        }
    }

    var introduction: String {
        return "이름: \(name). 나이: \(age)"
    }

    func speak() {
        print("안녕하세요~")
    }

    class func introduceClass() -> String {
        return "인류의 소원은 평화"
    }
}

let hyunjin: Person = Person()
hyunjin.name = "hyunjin"
hyunjin.age = 29
print(hyunjin.introduction)
hyunjin.speak()

// 클래스 상속
// 재정의: override 키워드 사용
// 재정의한 메서드나 프로퍼티의 부모버전을 사용하려면 super 키워드 사용
class Student: Person {
    var grade: String = "F"
    // 프로퍼티 감시자 재정의
    override var age: Int {
        didSet {
            print("Student age: \(self.age)")
        }
    }

    // 프로퍼티 재정의
    override var koreanAge: Int {
        get {
            return super.koreanAge
        }

        set {
            self.age = newValue - 1
        }

        // didSet{} // 설정자와 감시자를 동시에 정의할 순 없다.
    }

    override var fullName: String {
        
        didSet {
            print("Full name: \(self.fullName)")
        }
        
    }

    func study() {
        print("Study hard...")
    }

    override func speak() {
        print("저는 학생입니다.")
    }
}

let jiwoo: Person = Person()
jiwoo.name = "jiwoo"
jiwoo.age = 20
print(jiwoo.introduction)
jiwoo.speak()

let max: Student = Student()
max.name = "max"
max.age = 22
max.koreanAge = 23
max.grade = "A"
print(max.introduction)
max.speak()
max.study()
max.fullName = "Max Emilian Verstappen"

class UniversityStudent: Student {
    var major: String = ""

    // 부모의 introduceClass()와 반환타입이 다르므로 재정의가 아니다.
    class func introduceClass() {
        print(super.introduceClass())
    }

    override class func introduceClass() -> String {
        return "대학생의 소원은 A+입니다."
    }

    override func speak() {
        super.speak()
        print("대학생입니다.")
    }
}

let jenny: UniversityStudent = UniversityStudent()
jenny.major = "Art"
jenny.speak()
jenny.study()

print(Person.introduceClass())
print(Student.introduceClass())
print(UniversityStudent.introduceClass() as String)
UniversityStudent.introduceClass() as Void

// 서브스크립트 재정의
class School {
    var students: [Student] = [Student]()

    
    subscript(number: Int) -> Student {
        print("School subscript")
        return students[number]
    }
    
}

class MiddleSchool: School {
    var middleStudents: [Student] = [Student]()

    override subscript(index: Int) -> Student {
        print("MiddleSchool subscript")
        return middleStudents[index]
    }
    
}

let university: School = School()
university.students.append(Student())
print(university[0])

let middle: MiddleSchool = MiddleSchool()
middle.middleStudents.append(Student())
print(middle[0])

// 재정의 방지 : final 키워드 명시
class Person2 {
    final var name: String = ""
    
    final func speak() {
        print("Person2")
    }
}

final class Student2: Person2 {
    // 오류!
    // override var name: String {
    //     set {
    //         super.name = newValue
    //     }
    //     get {
    //         return "학생"
    //     }
    // }

    // override func speak() {
    //     print("저는 학생입니다.")
    // }
}

// 오류!
// class UniversityStudent: Student2 {

// }
