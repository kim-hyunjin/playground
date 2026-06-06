// 컬렉션 타입(배열, 딕셔너리, 세트)
// - 배열: 스위프트의 Array는 필요에 따라 자동으로 버퍼의 크기를 조절해주므로 요소의 삽입 및 삭제가 자유롭다.
// 기존 언어의 배열과는 다르게 swift는 이런 리스트타입을 Array라고 한다.
var names: Array<String> = ["hyunjin", "hyesung", "jihyun"]
var names2: [String] = ["hyunjin", "hyesung", "jihyun"]

var emptyArray: [Any] = [Any]()
var emptyArray2: [Any] = Array<Any>()
var emptyArray3: [Any] = []
print(emptyArray.isEmpty)
print(names.count)

print(names[2])
names[2] = "eunsung"
print(names[2])

// names[4] = "elsa" // Fatal error: Index out of range
names.append("elsa")
names.append(contentsOf: ["john", "max"])
names.insert("happy", at:2)
names.insert(contentsOf: ["jinhee", "minsoo"], at:5)
print(names)

let fitstItem: String = names.removeFirst()
let lastItem: String = names.removeLast()
let indexZeroItem: String = names.remove(at: 0)

print(fitstItem)
print(lastItem)
print(indexZeroItem)
print(names[1...3])
names[1...3] = ["A", "B", "C"]
print(names[1...3])