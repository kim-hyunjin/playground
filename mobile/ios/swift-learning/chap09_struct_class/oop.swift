// 구조체와 클래스는 데이터를 용도에 맞게 묶어 표현하고자 할 때 유용하다.
// 구조체와 클래스는 프로퍼티와 메서드를 사용해 구조화된 데이터와 가능을 가질 수 있다.
// => 하나의 새로운 사용자 정의 데이터 타입을 만듦

// 구조체와 클래스의 모습과 문법이 거의 흡사하다.
// 다만 구조체의 인스턴스는 값 타입이고, 클래스의 인스턴스는 참조 타입이다.
// 열거형도 값 타입
struct BasicInformation {
    var name: String
    var age: Int
}
var hyunjinInfo: BasicInformation = BasicInformation(name:"hyunjin", age:29)
hyunjinInfo.name = "jenny" // 변경가능
hyunjinInfo.age = 25   // 변경가능

let sebaInfo: BasicInformation = BasicInformation(name:"seba", age:30)
// sebaInfo.age = 20 // 변경불가

// 클래스
class Person {
    var height: Float = 0.0
    var weight: Float = 0.0
}

var hyunjin: Person = Person() // Person 클래스의 프로퍼티에 기본값이 지정되어 있으므로 전달인자를 통해 따로 초기값을 전달안해도 됨
hyunjin.height = 183.2
hyunjin.weight = 78.5

// 클래스 인스턴스의 소멸
// 클래스 인스턴스는 참조타입이므로 더는 참조할 필요가 없을 때 메모리에서 해제된다.
// 소멸하기 직전 deinit 메서드가 호출된다.
// 디이니셜라이저(deinit)는 클래스당 하나만 구현할 수 있으며, 매개변수와 반환값을 가질 수 없다.
class Person2 {
    var height: Float = 0.0
    var weight: Float = 0.0

    deinit {
        print("Person2 객체 소멸")
    }
}

// 구조체와 클래스의 차이
// 구조체는 상속할 수 없다.
// 타입캐스팅은 클래스의 인스턴스에만 허용된다.
// 디이니셜라이저는 클래스의 인스턴스에만 활용할 수 있다.
// 참조 횟수 계산은 클래스의 인스턴스에만 적용된다.

// 값 타입과 참조 타입의 차이
var friendInfo: BasicInformation = hyunjinInfo
print("hyunjin's age: \(hyunjinInfo.age)")
print("friend's age: \(friendInfo.age)")

friendInfo.age = 99
print("hyunjin's age: \(hyunjinInfo.age)") // 영향 없음
print("friend's age: \(friendInfo.age)")

var friend: Person = hyunjin
print("hyunjin's height \(hyunjin.height)")
print("friend's height \(friend.height)")

friend.height = 190
print("hyunjin's height \(hyunjin.height)") // 같이 바뀜
print("friend's height \(friend.height)")

func changeBasicInfo(_ info: BasicInformation) {
    var copiedInfo: BasicInformation = info
    copiedInfo.age = 1
}

func changePersonInfo(_ info: Person) {
    info.height = 150.3
}

changeBasicInfo(sebaInfo)
print("hyunjin's age: \(hyunjinInfo.age)")
print("seba's age: \(sebaInfo.age)") // 함수 호출후에도 값 변경이 없음

changePersonInfo(hyunjin)
print("hyunjin's height \(hyunjin.height)") // 함수 호출 후 값이 바뀜
print("friend's height \(friend.height)") // 함수 호출 후 값이 바뀜
print(hyunjin === friend) // 참조 비교

// 스위프트의 기본 데이터 타입은 모두 구조체다
/*
    ```
    public struct String {
        public init()
    }
    ```
*/
// 애플은 가이드라인에서 다음 조건 중 하나 이상에 해당한다면 구조체를 사용하는 것을 권장한다.
// 연관된 간단한 값의 집합을 캡슐화하는 것만이 목적일 때
// 캡슐화한 값을 참조하는 것보다 복사하는 것이 합당할 때
// 구조체에 저장된 프로퍼티가 값 타입이며 참조하는 것보다 복사하는 것이 합당할 때
// 다른 타입으로부터 상속받거나 자신을 상속할 필요가 없을 때

// 대다수 사용자 정의 데이터 타입은 클래스로 구현할 일이 더 많을 것이다.
