/*
    구조체, 클래스, 열거형, 프로토콜 타입에 새로운 기능을 추가할 수 있다.
    추가할 수 있는 기능
    - 연산 프로퍼티
    - 메서드
    - 이니셜라이저
    - 서브스크립트
    - 중첩 타입
    - 특정 프로토콜을 준수할 수 있도록 기능 추가

    새로운 기능을 추가할수는 있지만 기존에 존재하는 기능을 재정의할 수는 없다.
    익스텐션은 수평 확장, 상속은 수직 확장

    외부 라이브러리나 프레임워크를 가져다 사용한다면 원본 소스를 수정하지 못한다.
    여기에 내가 원하는 기능을 추가하고자 할 때 익스텐션을 사용한다.

    스위프트 표준 라이브러리 타입의 기능은 대부분 익스텐션으로 구현되어 있다.
*/
extension Int {
    var isEven : Bool {
        return self % 2 == 0
    }

    var isOdd: Bool {
        return self % 2 == 1
    }
}

print(1.isEven)
print(2.isEven)

var number: Int = 3
print(number.isEven)
print(number.isOdd)

// 익스텐션으로 연산 프로퍼티를 추가할 수는 있지만,
// 저장 프로퍼티는 추가할 수 없다.
// 기존의 프로퍼티에 감시자를 추가할 수도 없다.

// 메서드
extension Int {
    func multiply(by n: Int) -> Int {
        return self * n
    }

    mutating func multiplySelf(by n: Int) {
        self = self.multiply(by: n)
    }

    static func isIntTypeInstance(_ instance: Any) -> Bool {
        return instance is Int
    }
}

prefix operator ++

struct Position {
    var x: Int
    var y: Int
}

extension Position {
    // + 중위 연산 구현
    static func + (left: Position, right: Position) -> Position {
        return Position(x: left.x + right.x, y: left.y + right.y)
    }

    // - 전위 연산 구현
    static prefix func - (vector: Position) -> Position {
        return Position(x: -vector.x, y: -vector.y)
    }

    // += 복합할당 연산자 구현
    static func += (left: inout Position, right: Position) {
        left = left + right
    }
}

extension Position {
    // == 비교 연산자 구현
    static func == (left: Position, right: Position) -> Bool {
        return (left.x == right.x) && (left.y == right.y)
    }

    // != 비교 연산자 구현
    static func != (left: Position, right: Position) -> Bool {
        return !(left == right)
    }
}

extension Position {
    // ++ 사용자 정의 연산자 구현
    static prefix func ++ (position: inout Position) -> Position {
        position.x += 1
        position.y += 1
        return position
    }
}