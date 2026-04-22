// 필터는 컨테이너 내부의 값을 걸러서 추출하는 역할을 하는 함수.
// 새로운 컨테이너에 값을 담아 반환해준다. 기존 콘텐츠를 변형하는 것이 아니다.
// filter 함수의 매개변수로 전달되는 함수의 반환 타입은 Bool이다.
let numbers: [Int] = [0, 1, 2, 3, 4, 5]
let evenNumbers: [Int] = numbers.filter { (number: Int) -> Bool in
    return number % 2 == 0
}
print(evenNumbers)
let oddNumbers: [Int] = numbers.filter { $0 % 2 == 1 }
print(oddNumbers)

// 맵과 필터 연계
let oddNumbers2: [Int] = numbers.map{ $0 + 3 }.filter{ $0 % 2 == 1 }
print(oddNumbers2)