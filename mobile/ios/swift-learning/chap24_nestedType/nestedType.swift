class Person {
    enum Job {
        case jobless, programmer, student
    }
    var job: Job = .jobless
}

class Student: Person {
    enum School {
        case elementary, middle, high
    }
    var school: School

    init(school: School) {
        self.school = school
        super.init()
        self.job = .student
    }
}

let personJob: Person.Job = .jobless
print(personJob)
let student: Student = Student(school: .middle)
print(student.job)
print(student.school)

struct Sports {
    enum GameType {
        case football, basketball
    }
    
    var gameType: GameType

    struct GameInfo {
        var time: Int
        var player: Int
    }
    
    var gameInfo: GameInfo {
        switch self.gameType {
        case .basketball:
            return GameInfo(time: 40, player: 5)
        case .football:
            return GameInfo(time: 90, player: 11)
        }
    }
}

struct ESports {
    enum GameType {
        case online, offline
    }

    var gameType: GameType

    struct GameInfo {
        var location: String
        var package: String
    }

    var gameInfo: GameInfo {
        switch self.gameType {
        case .online:
            return GameInfo(location: "www.liveonline.co.kr", package: "LoL")
        case .offline:
            return GameInfo(location: "제주", package: "SA")
        }
    }
}

// 타입을 다른 타입 내부에 중첩하여 구현해 타입의 목적성을 명확히 할 수 있다.