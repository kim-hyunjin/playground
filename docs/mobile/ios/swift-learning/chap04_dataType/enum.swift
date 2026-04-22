// 연관된 항목들을 묶어서 표현할 수 있는 표현
// 다음 같은 경우에 요긴하게 사용할 수 있다.
// - 제한된 선택지를 주고 싶을때
// - 정해진 값 이외에는 입력받고 싶지 않을 때
// - 예상된 입력 값이 한정되어 있을 때

// 스위프트의 열거형은 항목별로 값을 가질 수도, 가지지 않을 수도 있다.
// C언어는 열거형의 각 항목 값이 정수 타입으로 기본 지정되지만, 스위프트의 열거형은 각 항목이 그 자체로 고유의 값이 될 수 있습니다.
// 스위프트의 주요 기증 중 하나인 옵셔널은 enum(열거형)으로 구현되어 있다.

// 기본 열거형
enum School {
    case primary
    case elementary
    case middle
    case high
    case college
    case university
    case graduate
}

enum School2 {
    case primary, elementary, middle, high, college, university, graduate
}

var highestEducationLevel: School = School.university
var highestEducationLevel2: School = .university
highestEducationLevel = .graduate // 같은 타입인 School 내부의 항목으로만 값을 변경할 수 있다.

// 열거형의 각 항목은 자체로도 하나의 값이지만 항목의 원시 값도 가질 수 있다.
enum School3: String {
    case primary = "유치원"
    case elementary = "초등학교"
    case middle = "중학교"
    case high = "고등학교"
    case college = "대학"
    case university = "대학교"
    case graduate = "대학원"
}

// 원시 값을 사용하고 싶다면 rawValue라는 프로퍼티를 통해 가져올 수 있다.
let myEducationLevel: School3 = School3.university
print("내 최종학력은 \(myEducationLevel.rawValue)")

enum WeekDays: Character {
    case mon = "월", tue = "화", wed = "수", thu = "목", fri = "금", sat = "토", sun = "일"
}

let today: WeekDays = .fri
print("오늘은 불타는 \(today.rawValue)요일!")

// String 타입이라면 원시값을 안줬을때 각 항목 이름을 그대로 원시값으로 갖는다.
// 정수 타입이라면 첫 항목을 기준으로 0부터 1씩 늘어난 값을 갖는다.
enum WeekDays2: String {
    case mon = "월"
    case tue = "화"
    case wed = "수"
    case thu = "목"
    case fri
    case sat
    case sun
}
print("오늘은 불타는 \(WeekDays2.fri.rawValue)요일!")

enum Numbers: Int {
    case zero
    case one
    case two
    case ten = 10
}

print("\(Numbers.zero.rawValue), \(Numbers.one.rawValue), \(Numbers.ten.rawValue)")

// 원시값을 갖는 열거형일때 원시값을 통해 열거형 변수를 생성해 줄 수 있다.
let primary = School3(rawValue: "유치원")
let graduate = School3(rawValue: "박사") // nil
let one = Numbers(rawValue: 1) // one
let three = Numbers(rawValue: 3) // nil

// 열거형 내의 항목(case)이 자신과 연관된 값을 가질 수 있다.
enum MainDish {
    case pasta(taste: String)
    case pizza(dough: String, topping: String)
    case chicken(withSauce: Bool)
    case rice
}

var dinner: MainDish = MainDish.pasta(taste: "크림")
dinner = .pizza(dough: "치즈크러스트", topping: "페퍼로니")
dinner = .chicken(withSauce: true)
dinner = .rice

// 연관된 값을 한정 지으려면 열거형으로 바꾸면 된다.

enum PastaTaste {
    case cream, tomato
}
enum PizzaDough {
    case cheeseCrust, thin, original
}
enum PizzaTopping {
    case pepperoni, cheese, bacon
}
enum MainDish2 {
    case pasta(taste: PastaTaste)
    case pizza(dough: PizzaDough, topping: PizzaTopping)
    case chicken(withSauce: Bool)
    case rice
}

var dinner2: MainDish2 = MainDish2.pasta(taste: PastaTaste.tomato)
dinner2 = .pizza(dough: PizzaDough.thin, topping: PizzaTopping.bacon)

// 항목 순회 - 열거형의 항목 뒤에 CaseIterable 프로토콜을 채택해주자.
// 그러면 allCases라는 이름의 타입 프로퍼티를 통해 모든 케이스의 컬렉션을 생성해준다.
enum School4: CaseIterable {
    case primary
    case elementary
    case middle
    case high
    case college
    case university
    case graduate
}

let allCases: [School4] = School4.allCases
print(allCases)
enum School5: String, CaseIterable {
    case primary = "유치원"
    case elementary = "초등학교"
    case middle = "중학교"
    case high = "고등학교"
    case college = "대학"
    case university = "대학교"
    case graduate = "대학원"
}
let allCases2: [School5] = School5.allCases
print(allCases2)

// available 속성을 갖는 열거형의 항목 순회
// 특정 케이스를 통해 플랫폼에 따라 사용여부가 달라진다면 CaseIterable 프로토콜을 채택하는 것만으로는 allCases 프로퍼티를 사용할 수 없다.
// 이때는 직접 allCases 프로퍼티를 구현해 주어야 한다.
enum School6: String, CaseIterable {
    case primary = "유치원"
    case elementary = "초등학교"
    case middle = "중학교"
    case high = "고등학교"
    case college = "대학"
    case university = "대학교"
    @available(iOS, obsoleted: 12.0)
    case graduate = "대학원"

    static var allCases: [School6] {
        let all: [School6] = [
            .primary,
            .elementary,
            .middle,
            .high,
            .college,
            .university
        ]
        #if os(iOS) // 조건부 컴파일
        return all
        #else
        return all + [.graduate]
        #endif
    }
}

let allCases3: [School6] = School6.allCases
print(allCases3)

// 연관 값을 갖는 열거형의 항목 순회
enum PastaTaste2: CaseIterable {
    case cream, tomato
}
enum PizzaDough2: CaseIterable {
    case cheeseCrust, thin, original
}
enum PizzaTopping2: CaseIterable {
    case pepperoni, cheese, bacon
}
enum MainDish3: CaseIterable {
    case pasta(taste: PastaTaste2)
    case pizza(dough: PizzaDough2, topping: PizzaTopping2)
    case chicken(withSauce: Bool)
    case rice

    static var allCases: [MainDish3] {
        return PastaTaste2.allCases.map(MainDish3.pasta)
            + PizzaDough2.allCases.reduce([]) {
            (result, dough) -> [MainDish3] in 
                result + PizzaTopping2.allCases.map { (topping) -> MainDish3 in 
                    MainDish3.pizza(dough: dough, topping: topping)
                }
            }
            + [true, false].map(MainDish3.chicken)
            + [MainDish3.rice]
    }
}

print(MainDish3.allCases.count)
print(MainDish3.allCases)

// 순환 열거형
// 열거형 항목의 연관 값이 자신이고자 할때 사용한다.
// 순환 열거형을 명시하고 싶다면 indirect 키워드를 사용하면 된다.
enum ArithmeticExpression {
    case number(Int)
    indirect case addition(ArithmeticExpression, ArithmeticExpression)
    indirect case multiplication(ArithmeticExpression, ArithmeticExpression)
}

indirect enum ArithmeticExpression2 {
    case number(Int)
    case addition(ArithmeticExpression2, ArithmeticExpression2)
    case multiplication(ArithmeticExpression2, ArithmeticExpression2)
}

// (5 + 4) X 2
let five = ArithmeticExpression.number(5)
let four = ArithmeticExpression.number(4)
let sum = ArithmeticExpression.addition(five, four)
let finalExp = ArithmeticExpression.multiplication(sum, ArithmeticExpression.number(2))

func evaluate(_ expression: ArithmeticExpression) -> Int {
    switch expression {
    case .number(let value):
        return value
    case .addition(let left, let right):
        return evaluate(left) + evaluate(right)
    case .multiplication(let left, let right):
        return evaluate(left) * evaluate(right)
    }   
}

let result: Int = evaluate(finalExp)
print("(5 + 4) * 2 = \(result)")