var step: Int = 1

func increment(_ number: inout Int) {
    number += step
}

// increment(&step) // 오류발생 Simultaneous accesses to 0x7f10cbc21000

func balance(_ x: inout Int, _ y: inout Int) {
    let sum = x + y
    x = sum / 2
    y = sum - x
}
var oneScore: Int = 42
var twoScore: Int = 30
balance(&oneScore, &twoScore) // 문제없음
// balance(&oneScore, &oneScore) // 오류발생
// error: inout arguments are not allowed to alias each other
// error: overlapping accesses to 'oneScore', but modification requires exclusive access; consider copying to a local variable

// 메소드 내부에서 self 접근의 충돌
struct GamePlayer {
    var name: String
    var health: Int
    var energy: Int

    static let maxHealth = 10

    mutating func restoreHealth() {
        self.health = GamePlayer.maxHealth
    }

    mutating func shareHealth(with teamate: inout GamePlayer) {
        balance(&teamate.health, &health)
    }
}

var oscar: GamePlayer = GamePlayer(name: "Oscar", health: 10, energy: 10)
var maria: GamePlayer = GamePlayer(name: "Maria", health: 5, energy: 10)
oscar.shareHealth(with: &maria)

// oscar.shareHealth(with: &oscar) // 오류발생

/*
    다음 세가지 조건을 충족하면 구조체의 프로퍼티 메모리에 동시 접근하더라도 안전하다
    1. 연산 프로퍼티나 클래스 프로퍼티가 아닌 인스턴스의 저장 프로퍼티에만 접근
    2. 전역 변수가 아닌 지역변수일때
    3. 클로저에 의해 캡처되지 않았거나 비탈출 클로저에 의해서만 획득되었을때
*/
