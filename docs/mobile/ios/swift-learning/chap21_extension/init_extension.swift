// 익스텐션을 통해 이니셜라이저를 추가할 수 있다.
// 클래스타입에 편의 이니셜라이저는 추가할 수 있지만, 지정 이니셜라이저는 추가할 수 없다.

extension String {
    init(intTypeNumber: Int) {
        self = "\(intTypeNumber)"
    }

    init(doubleTypeNumber: Double) {
        self = "\(doubleTypeNumber)"
    }
}

class Person {
    var name: String

    init(name: String) {
        self.name = name
    }
}

extension Person {
    convenience init() {
        self.init(name: "Unknown")
    }
}

struct Size {
    var width: Double = 0.0
    var height: Double = 0.0
}

struct Point {
    var x: Double = 0.0
    var y: Double = 0.0
}

// 추가로 사용자 정의 이니셜라이저를 구현하지 않았기 때문에
// 기본 이니셜라이저, 멤버와이즈 이니셜라이저 사용 가능
struct Rect {
    var origin: Point = Point()
    var size: Size = Size()
}

extension Rect {
    init(center: Point, size: Size) {
        let originX: Double = center.x - (size.width / 2)
        let originY: Double = center.y - (size.height / 2)
        // 멤버와이즈 이니셜라이저에게 초기화 위임
        self.init(origin: Point(x: originX, y: originY), size: size)
    }
}