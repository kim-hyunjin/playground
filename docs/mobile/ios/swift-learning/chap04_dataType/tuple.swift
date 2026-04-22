// 타입 별칭
typealias MyInt = Int
typealias MyDouble = Double

let age: MyInt = 100
let percentage: MyDouble = 99.9

// 튜플
var person: (String, Int, Double) = ("hyunjin", 29, 183.5)

// 인덱스를 통해 값을 빼올 수 있다.
print("이름: \(person.0), 나이: \(person.1), 신장: \(person.2)")

// 인덱스를 통해 값을 할당할 수 있다.
person.1 = 30
person.2 = 1.1

print("이름: \(person.0), 나이: \(person.1), 신장: \(person.2)")

// 튜플의 요소마다 이름을 붙일 수 있다.
var person2: (name: String, age: Int, height: Double) = ("hyunjin", 29, 183.5)
print("이름: \(person2.name), 나이: \(person2.age), 신장: \(person2.height)")

// 튜플에 별칭을 지정할 수 있다.

typealias PersonTuple = (name: String, age: Int, height: Double)
let hyunjin: PersonTuple = ("hyunjin", 29, 183.5)
print("이름: \(hyunjin.name), 나이: \(hyunjin.age), 신장: \(hyunjin.height)")



