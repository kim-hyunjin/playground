// 클래스, 구조체, 열거형에는 컬렉션, 리스트, 시퀀스 등의 요소에 접근하는 단축 문법인 서브스크립트를 정의할 수 있다.
// 서브스크립트는 별도의 설정자(set) 또는 접근자(get) 메서드를 구현하지 않아도 인덱스를 통해 값을 설정하거나 가져올 수 있다.
// 한 타입에 여러 개의 서브스크립트를 정의할 수 있으며, 다른 타입을 인덱스로 갖는 여러개의 서브스크립트를 오버로드 할 수 있다.
// 인스턴스 메서드와 비슷하게 매개변수의 개수, 타입, 반환타입 등을 지정하며, 읽고쓰기가 가능하도록 구현하거나 읽기 전용으로만 구현할 수 있다.
/*
    subscript(index: Int) -> Int {
        get {

        }

        set(newValue) {

        }
    }

    // 읽기 전용
    subscript(index: Int) -> Int {
        get {

        }
    }

    subscript(index: Int) -> Int {

    }
*/

struct Student {
    var name: String
    var number: Int
}

class School {
    var number: Int = 0
    var students: [Student] = [Student]()

    func addStudent(name: String) {
        let student: Student = Student(name: name, number: self.number)
        self.students.append(student)
        self.number += 1
    }

    func addStudents(names: String...) {
        for name in names {
            self.addStudent(name: name)
        }
    }

    // subscript(index: Int) -> Student? {
    //     if index < self.number {
    //         return self.students[index]
    //     }
    //     return nil
    // }
    subscript(index: Int) -> Student? {
        get {
            if index < self.number {
                return self.students[index]
            }
            return nil
        }

        set {
            guard var newStudent: Student = newValue else {
                return
            }

            var number: Int = index
            if index > self.number {
                number = self.number
                self.number += 1
            }

            newStudent.number = number
            self.students[number] = newStudent
        }
    }

    subscript(name: String) -> Int? {
        get {
            return self.students.filter{ $0.name == name }.first?.number
        }

        set {
            guard var number: Int = newValue else {
                return
            }

            if number > self.number {
                number = self.number
                self.number += 1
            }

            let newStudent: Student = Student(name: name, number: number)
            self.students[number] = newStudent
        }
    }

    subscript(name: String, number: Int) -> Student? {
        return self.students.filter{ $0.name == name && $0.number == number }.first
    }
}

let highSchool: School = School()
highSchool.addStudents(names: "hyunjin", "max", "ferez", "hamilton")

let aStudent: Student? = highSchool[1]
print("\(aStudent?.number as Any) \(aStudent?.name as Any)")

print(highSchool["hyunjin"] as Any) // Optional(0)
print(highSchool["nobody"] as Any) // nil

highSchool[0] = Student(name: "jiwoo", number: 0)
highSchool["khan"] = 1
print(highSchool["hyunjin"] as Any) // nil
print(highSchool["khan"] as Any) // Optional(1)
print(highSchool["jiwoo", 0] as Any) // Optional(subscript.Student(name: "jiwoo", number: 0))
print(highSchool["khan", 0] as Any) // nil

// 타입 서브스크립트
// 인스턴스가 아닌 타입 자체에서 사용할 수 있는 서브스크립트
enum SchoolEnum: Int {
    case elementary = 1, middle, high, university

    static subscript(level: Int) -> SchoolEnum? {
        return Self(rawValue: level)
    }
}

let school: SchoolEnum? = SchoolEnum[2]
print(school as Any) // Optional(subscript.SchoolEnum.middle)