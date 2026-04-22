// 같은 타입의 데이터를 순서 없이 하나의 묶음으로 저장하는 형태의 컬렉션 타입
// 세트 내의 모든 값은 유일하다. 즉 중복된 값이 존재하지 않는다. 
// 그래서 세트는 보통 순서가 중요하지 않거나 각 요소가 유일한 값이어야 하는 경우에 사용한다.
// 또, 세트의 요소로는 해시 가능한 값이 들어와야 한다.(스위프트 표준 라이브러리의 Hashable 프로토콜을 따르는 값 - 스위프트의 기본 데이터 타입은 모두 해시 가능한 값이다.)
var names: Set<String> = Set<String>()
var names2: Set<String> = []
// Array와 마찬가지로 대괄호를 사용한다.
var names3: Set<String> = ["hyunjin", "max", "ferez", "hyunjin"]
var numbers = [100, 200, 300] // 타입 추론을 사용하면 컴파일러는 Set이 아닌 Array타입을 지정한다.
print(type(of: numbers)) // Array<Int>

print(names3.isEmpty)
print(names3.count)

names3.insert("jenny")
print(names3.count)

print("\(names3.remove("max") as String?)") // max
print("\(names3.remove("john") as String?)") // nil

// 세트는 자신 내부의 값들이 모두 유일함을 보장하므로, 집합관계를 표현하고자 할 때 유용하게 쓸 수 있으며,
// 두 세트의 교집합 합칩합 등을 연산하기에 매우 용이하다.
// 또한 sorted() 메서드를 통해 정렬된 배열을 반환해 줄 수 있다.
let englishClassStudents: Set<String> = ["john", "chulsoo", "hyunjin"]
let koreanClassStudents: Set<String> = ["jenny", "chulsoo", "hyunjin", "hana", "minsoo"]

// 교집합
let intersectSet: Set<String> = englishClassStudents.intersection(koreanClassStudents)
// 여집합
let symmetricDiffSet: Set<String> = englishClassStudents.symmetricDifference(koreanClassStudents)
// 합집합
let unionSet: Set<String> = englishClassStudents.union(koreanClassStudents)
// 차집합
let subtractSet: Set<String> = englishClassStudents.subtracting(koreanClassStudents)

print(intersectSet.sorted())
print(symmetricDiffSet.sorted())
print(unionSet.sorted())
print(subtractSet.sorted())

// 포함관계 연산
let 새: Set<String> = ["비둘기", "닭", "기러기"]
let 포유류: Set<String> = ["사자", "호랑이", "곰"]
let 동물: Set<String> = 새.union(포유류)

print("서로 배타적인가? \(새.isDisjoint(with: 포유류))")
print("새가 동물의 부분집합인가? \(새.isSubset(of: 동물))")
print("동물은 포유류의 전체집합인가? \(동물.isSuperset(of: 포유류))")
print("동물은 새의 전체집합인가? \(동물.isSuperset(of: 새))")

// 임의의 요소 추출과 뒤섞기
var arr: [Int] = [0,1,2,3,4]
var mySet: Set<Int> = [0,1,2,3,4]
var dict: [String: Int] = ["a": 1, "b": 2, "c": 3]
var string: String = "string"

print("\(arr.randomElement() as Any)") // 임의의 요소
print(arr.shuffled()) // 뒤죽박죽 배열 - array 내부의 요소는 그대로 있다.
print(arr)
arr.shuffle() // 원본 배열 뒤섞기
print(arr)
print(mySet.shuffled())
// mySet.shuffle() // 오류발생! 세트는 순서가 없기 때문에 스스로 뒤섞을 수 없다. value of type 'Set<Int>' has no member 'shuffle'
print(dict.shuffled()) // 딕셔너리를 뒤섞으면 (키, 값)쌍 튜플의 배열을 반환한다. [(key: "a", value: 1), (key: "c", value: 3), (key: "b", value: 2)]
print(string.shuffled()) // String도 컬렉션이다!