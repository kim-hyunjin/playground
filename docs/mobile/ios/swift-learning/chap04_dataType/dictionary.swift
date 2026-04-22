// 딕셔너리는 요소들이 순서 없이 키와 값의 쌍으로 구성되는 컬렉션 타입
// 키는 같은 이름을 중복해서 사용할 수 없다.


typealias StringIntDictionary = [String: Int]
var numberForName: Dictionary<String, Int> = Dictionary<String, Int>()
var numberForName2: [String: Int] = [String: Int]() // 축약표현
var numberForName3: StringIntDictionary = StringIntDictionary()
var numberForName4: [String: Int] = [:] // 딕셔너리의 키와 값 타입을 명시했다면 [:]만으로도 생성할 수 있다.

var numberForName5: [String: Int] = ["hyunjin": 100, "max": 200, "ferez": 300]
print(numberForName5.isEmpty)
print(numberForName5.count)

print("\(numberForName5["hyunjin"] as Int?)") // 100
print("\(numberForName5["hamilton"] as Int?)") // nil

numberForName5["hamilton"] = 999
print("\(numberForName5["hamilton"] as Int?)")
print("\(numberForName5.removeValue(forKey: "hyunjin") as Int?)")
print("\(numberForName5.removeValue(forKey: "hyunjin") as Int?)") // nil
print(numberForName5["hyunjin", default: 0]) // 키에 해당하는 값이 없을 때 기본으로 반환할 값을 지정할 수 있다.