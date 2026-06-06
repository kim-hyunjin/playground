// 리듀스는 컨테이너 내부의 콘텐츠를 하나로 합하는 기능을 실행하는 함수다.
// 배열이라면 배열의 모든 값을 전달인자로 받은 클로저의 연산 결과로 합해준다.

// 스위프트의 리듀스는 두 가지 형태로 구현되어 있다.
// 첫번째, 각 요소를 전달받아 연산한 후 값을 다음 클로저 실행을 위해 반환하며 컨테이너를 순환하는 형태
/*
    public func reduce<Result>(_ initialResult: Result, _ nextPartialResult: (Result, Element) throws -> Result) rethrows -> Result

    initialResult라는 매개변수로 전달되는 값으 통해 초기값을 지정
    nextPartialResult라는 매개변수로 클로저를 전달 받는다.
    nextPartialResult 클로저의 첫번째 매개변수는 initialResult로 받은 초기값 또는 이전 클로저의 결과값이다.
    모든 순회가 끝나면 리듀스의 최종 결과값이 된다.
    nextPartialResult 클로저의 두번째 매개변수는 리듀스 메서드가 순회할 컨테이너 요소다.
*/


// 두번째, 컨테이너를 순환하며 클로저가 실행되지만 따로 결과값을 반환하지 않는 형태
/*
    public func reduce<Result>(into initialResult: Result, _ updateAccumulatingResult: (inout Result, Element) throws -> ()) rethrows -> Result

    updateAccumulatingResult 매개변수로 전달받는 클로저의 첫번째 매개변수를 inout으로 사용한다.
    이 inout 변수는 initialResult로 전달받은 초기값 또는 이전에 실행된 클로저에 의해 변경된 결과값이다.
    모든 순회가 끝나면 리듀스의 최종 결과값이 된다.
    updateAccumulatingResult의 두번째 매개변수는 리듀스 메서드가 순회할 컨테이너 요소다.
*/

// reduce(_:_:) 형태
let numbers: [Int] = [1, 2, 3]

var sum: Int = numbers.reduce(0, {(result: Int, next: Int) -> Int in
    print("\(result) + \(next)")
    return result + next
})
print(sum)

let subtract: Int = numbers.reduce(0, {(result: Int, next: Int) -> Int in
    print("\(result) - \(next)")
    return result - next
})
print(subtract)

let sumFromThree: Int = numbers.reduce(3) {
    print("\($0) + \($1)")
    return $0 + $1
}
print(sumFromThree)

var subtractFromThree: Int = numbers.reduce(3) {
    print("\($0) - \($1)")
    return $0 - $1
}
print(subtractFromThree)

let names: [String] = ["Chope", "Jay", "Joker", "Nova"]

let reducedNames: String = names.reduce("hj's friend: ") {
    return $0 + ", " + $1
}
print(reducedNames)

// reduce(into:_:) 형태
sum = numbers.reduce(into: 0, {(result: inout Int, next: Int) in 
    print("\(result) + \(next)")
    result += next
})
print(sum)

subtractFromThree = numbers.reduce(into: 3) {
    print("\($0) - \($1)")
    $0 -= $1
}
print(subtractFromThree)

// 다른 컨테이너에 값을 변경하여 넣어줄 수도 있다. -> 맵이나 필터와 유사한 형태로 사용할 수 있음
var doubledNumbersWithoutOdd: [Int] = numbers.reduce(into: []) {
    print("result: \($0), next: \($1)")

    guard $1 % 2 == 0 else {
        return
    }

    $0.append($1 * 2)
}
print(doubledNumbersWithoutOdd)

// 필터와 맵 사용
doubledNumbersWithoutOdd = numbers.filter { $0.isMultiple(of: 2) }.map { $0 * 2 }
print(doubledNumbersWithoutOdd)

var upperCasedNames: [String]
upperCasedNames = names.reduce(into: [], {
    $0.append($1.uppercased())
})
print(upperCasedNames)

// 맵 사용
upperCasedNames = names.map{$0.uppercased()}
print(upperCasedNames)

// 맵, 필터, 리듀스 연계
let numbers2: [Int] = [1, 2, 3, 4, 5, 6, 7]
var result: Int = numbers2.filter{$0.isMultiple(of: 2)}.map{$0 * 3}.reduce(0) {$0 + $1}
print(result)