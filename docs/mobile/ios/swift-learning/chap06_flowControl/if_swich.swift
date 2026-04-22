// 스위프트의 흐름제어 구문에서는 소괄호를 대부분 생략할 수 있다.

// if  구문은 조건의 값이 꼭 Bool 타입이어야 한다.
let first: Int = 5
let second: Int = 7

if first > second {
    print("first > second")
} else if first < second {
    print("first < second")
} else {
    print("first == second")
}

// switch 구문은 다른언어와 비교했을 때 많이 달라진 문법 중 하나다.
// 소괄호를 생략할 수 있으며, break 키워드 사용은 선택 사항이다.
// 즉 case내부의 코드를 모두 실행하면 break 없이도 switch 구문이 종료된다.
// 스위프트에서 switch 구문의 case를 연속 실행하려면 fallthrough 키워드를 사용한다.
// C 언어에서는 정수 타입만 들어갈 수 있으나 스위프트에서는 조건에 다양한 값이 들어갈 수 있다.
// 또 비교될 값이 명확히 한정적인 값이 아닐 때는 default 를 꼭 작성해줘야 한다.
// case에는 범위 연산자를 사용할 수도, where 절을 사용해 조건을 확장할 수도 있다.

let integerVal: Int = 5

switch integerVal {
    case 0:
        print("value == zero")
    case 1...10:
        print("value == 1 ~ 10")
        fallthrough
    case Int.min..<0, 101..<Int.max:
        print("value < 0 or value > 100")
        break
    default:
        print("10 < value <= 100")
}
// 부동 소수점, 문자, 문자열, 열거형, 튜플, 범위, 패턴이 적용된 타입 등 다양한 타입의 값 사용 가능.
let stringVal: String = "Kim Hyunjin"

switch stringVal {
    case "Kim Hyunjin":
        print("Kim Hyunjin")
    case "max":
        print("max")
    case "jenny", "joker", "nova":
        print("He or She is \(stringVal)")
    default:
        print("\(stringVal) said I don't know who you are")
}
// case xxx: 다음에는 꼭 실행 가능한 코드가 위치해야 한다.


typealias Person = (name: String, age: Int)
var tupleVal: Person = ("hyunjin", 29)

switch tupleVal {
    case ("hyunjin", 29):
        print("correct!")
    default:
        print("누굴 찾나요?")
}

// 와일드카드 식별자(_)와 함께 사용하면 더 유용하다.
tupleVal = ("max", 29)
switch tupleVal {
    case ("hyunjin", 29):
        print("correct!")
    case ("hyunjin", _):
        print("이름만 맞습니다.")
    case (_, 29):
        print("나이만 맞습니다.")
    default:
        print("누굴 찾나요?")
}

// case 문에서 미리 지정된 조건 값을 제외한 다른 값을 가져오기
switch tupleVal {
    case ("hyunjin", 29):
        print("correct!")
    case ("hyunjin", let age):
        print("이름만 맞습니다. 입력한 나이: \(age)")
    case (let name, 29):
        print("나이만 맞습니다. 입력한 이름: \(name)")
    default:
        print("누굴 찾나요?")
}

// where절을 사용한 확장
let 직급: String = "사원"
let 연차: Int = 1
let 인턴여부: Bool = false

switch 직급 {
    case "사원" where 인턴여부 == true:
        print("인턴입니다.")
    case "사원" where 연차 < 2 && 인턴여부 == false:
        print("신입사원입니다.")
    case "사원" where 연차 > 5:
        print("베테랑 사원입니다.")
    case "사원":
        print("사원입니다.")
    case "대리":
        print("대리입니다.")
    default:
        print("올바른 직급이 아닙니다.")
}

// 열거형을 사용할경우 default를 생략할 수 있다.
enum School {
    case primary, elementary, middle, high, colleage, university, graduate
}

let 최종학력: School = School.university
switch 최종학력 {
    case .primary:
    fallthrough
    case .elementary:
    fallthrough
    case .middle:
    fallthrough
    case .high:
        print("최종학력: 고등학교")
    case .colleage:
    fallthrough
    case .university:
        print("최종학력: 대학교")
    case .graduate:
        print("최종학력: 대학원")
}

// 열거형이 추가되면 switch case도 똑같이 추가되어야 한다.
// 이런 문제를 해결하기 위해 5.0버전에서 추가된 unknown 속성 사용
enum Menu {
    case chicken
    case pizza
}

let lunchMenu: Menu = .pizza

switch lunchMenu {
    case .chicken:
        print("치킨")
    case .pizza:
        print("피자")
    @unknown case _:
        print("오늘 메뉴가 뭐죠?")
}
// case _:를 사용하면 열거형에 case를 추가해도 switch 구문에서 컴파일 오류가 발생하지 않는다.
// 문법적으로는 오류가 없지만 논리적 오류가 발생할 수 있으므로 @unknown 사용 - 경고를 발생시킨다.