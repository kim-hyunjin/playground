// 인스턴스 메서드
class LevelClass {
    var level: Int = 0 {
        didSet {
            print("Level \(level)")
        }
    }

    func levelUp() {
        print("level up!")
        level += 1
    }

    func levelDown() {
        print("level down")
        level -= 1
        if level < 0 {
            reset()
        }
    }

    func jumpLevel(to: Int) {
        print("jump to \(to)")
        level = to
    }

    func reset() {
        print("level reset")
        level = 0
    }
}

var lv: LevelClass = LevelClass()
lv.levelUp()
lv.levelDown()
lv.levelDown()
lv.jumpLevel(to: 3)

// 자신의 프로퍼티 값을 수정할 때 클래스의 인스턴스 메서드는 크게 신경 쓸 필요가 없지만,
// 구조체나 열거형 등은 값 타입이므로 메서드 앞에 mutating 키워드를 붙여서 해당 메서드가 내부의 값을 변경한다는 것을 명시해야 한다.

struct LevelStruct {
    var level: Int = 0 {
        didSet {
            print("Level \(level)")
        }
    }

    mutating func levelUp() {
        print("level up!")
        level += 1
    }

    mutating func levelDown() {
        print("level down")
        level -= 1
        if level < 0 {
            reset()
        }
    }

    mutating func jumpLevel(to: Int) {
        print("jump to \(to)")
        level = to
    }

    mutating func reset() {
        print("level reset")
        level = 0
    }
} 
var lvStruct: LevelStruct = LevelStruct()
lvStruct.levelUp()
lvStruct.levelDown()
lvStruct.levelDown()
lvStruct.jumpLevel(to: 3)

// self 프로퍼티
// 모든 인스턴스는 암시적으로 생성된 self 프로퍼티를 갖는다.
// 클래스의 인스턴스는 참조 타입이라 self 프로퍼티에 다른 참조를 할당할 수 없는데
// 구조체나 열거형등은 self 프로퍼티를 사용해 자기 자신을 치환할 수 있다.
enum OnOffSwitch {
    case on, off
    mutating func nextState() {
        self = self == .on ? .off : .on
    }
}

var toggle: OnOffSwitch = OnOffSwitch.off
toggle.nextState()
print(toggle)

// 타입 메서드
// static으로 정의하면 상속 후 메서드 재정의가 불가능하고
// class로 정의하면 상속 후 메서드 재정의가 가능하다.
class AClass {
    static func staticTypeMethod() {
        print("AClass staticTypeMethod")
    }
    class func classTypeMethod() {
        print("AClass classTypeMethod")
    }
}

class BClass: AClass {
    /*
    // cannot override static method
    override static func staticTypeMethod() {

    }
    */

    override class func classTypeMethod() {
        print("BClass classTypeMethod")
    }
}

AClass.staticTypeMethod()
AClass.classTypeMethod()
BClass.classTypeMethod()

// 타입 메서드에서 self 프로퍼티는 타입 그 자체를 가리킨다.
struct SystemVolume {
    static var volume: Int = 5
    static func mute() {
        self.volume = 0 // SystemVolume.volume = 0
    }
}

class Navigation {
    var volume: Int = 5

    func guideWay() {
        SystemVolume.mute()
    }

    func finishGuildWay() {
        SystemVolume.volume = self.volume
    }
}

SystemVolume.volume = 10

let myNavi: Navigation = Navigation()

myNavi.guideWay()
print(SystemVolume.volume)
myNavi.finishGuildWay()
print(SystemVolume.volume)