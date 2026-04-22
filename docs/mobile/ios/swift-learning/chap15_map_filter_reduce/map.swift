// 자신을 호출할 때 매개변수로 전달된 함수를 실행하여 그 결과를 다시 반환해주는 함수
// 배열, 딕셔너리, 세트, 옵셔널 등에서 사용할 수 있다.
// 정확히는 Sequence, Collection 프로토콜을 따르는 타입과 옵셔널은 모두 맵을 사용할 수 있다.

// 맵을 사용하면 컨테이너가 담고 있던 각각의 값을 매개변수를 통해 받은 함수에 적용한 후 다시 컨테이너에 포장해 반환한다.
// 기존 컨테이너의 값은 변경되지 않고 새로운 컨테이너가 생성되어 반환된다.
let numbers: [Int] = [0, 1, 2, 3, 4]

var doubledNumbers: [Int] = [Int]()
var strings: [String] = [String]()

for number in numbers {
    doubledNumbers.append(number * 2)
    strings.append("\(number)")
}

print(doubledNumbers)
print(strings)

doubledNumbers = numbers.map({(number: Int) -> Int in 
    return number * 2
})
strings = numbers.map({(number: Int) -> String in 
    return "\(number)"
})

print(doubledNumbers)
print(strings)

// 매개변수 및 반환 타입 생략
doubledNumbers = numbers.map({return $0 * 2})
// 반환 키워드 생략, 후행 클로저 사용
doubledNumbers = numbers.map {$0 * 2}

// 클로저의 반복 사용
let evenNumbers: [Int] = [0, 2, 4, 6, 8]
let oddNumbers: [Int] = [0, 1, 3, 5, 7]
let multiplyTwo: (Int) -> Int = {$0 * 2}

let doubledEvenNumbers = evenNumbers.map(multiplyTwo)
print(doubledEvenNumbers)
let doubledOddNumbers = oddNumbers.map(multiplyTwo)
print(doubledOddNumbers)

// 다양한 컨테이너 타입에서 활용
let alphabetDict: [String: String] = ["a": "A", "b": "B"]

var keys: [String] = alphabetDict.map { (tuple: (String, String)) -> String in
    return tuple.0
}
print(keys)
keys = alphabetDict.map { $0.0 }
print(keys)

let values: [String] = alphabetDict.map { $0.1 }
print(values)

var numberSet: Set<Int> = [1, 2, 3, 4, 5]
let resultSet = numberSet.map { $0 * 2 }
print(resultSet)

let optionalInt: Int? = 3
let resultInt: Int? = optionalInt.map { $0 * 2 }
print(resultInt as Any)

let range: CountableClosedRange = (0...3)
let resultRange: [Int] = range.map { $0 * 2 }
print(resultRange)