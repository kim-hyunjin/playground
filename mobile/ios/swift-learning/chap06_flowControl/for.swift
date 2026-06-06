/*
    for-in 구문
    반복적인 데이터나 시퀀스를 다룰 때 많이 사용한다.
    ```
        for 임시 상수 in 시퀀스 아이템 {
            실행코드
        }
    ```
*/
for i in 0...2 {
    print(i)
}

for i in 0...5 {
    if i.isMultiple(of: 2) {
        print(i)
        continue
    }
    print("\(i) == 홀수")
}

let helloSwift: String = "Hello Swift!"
for c in helloSwift {
    print(c)
}

var result: Int = 1

// 시퀀스에 해당하는 값이 필요없다면 _ 사용
for _ in 1...3 {
    result += 10
}
print("10의 세제곱은 \(result)")

let friends: [String:Int] = ["Jay": 35, "Joe": 29, "Jenny": 31]
for f in friends {
    print(f)
}

let addr: [String:String] = ["도": "서울특별시", "시군구": "관악구", "동읍면": "봉천동"]
for (k, v) in addr {
    print("\(k): \(v)")
}

let 지역번호: Set<String> = ["02", "031", "032", "033"]
for 번호 in 지역번호 {
    print(번호)
}

// while
var names: [String] = ["joker", "jenny", "nova", "hyunjin"]
while names.isEmpty == false {
    print("Good bye \(names.removeFirst())")
}

// repeat-while: do-while
names = ["joker", "jenny", "nova", "hyunjin"]
repeat {
    print("Good bye \(names.removeFirst())")
} while names.isEmpty == false

// 반복문 앞에 이름: 을 붙여 구문 이름표를 달아주면 제어 키워드와 함께 쓰기 좋다.
var numbers: [Int] = [3, 123, 234, 5555]
numbersLoop: for num in numbers {
    if num > 5 || num < 1 {
        continue numbersLoop
    }

    var count: Int = 0

    printLoop: while true {
        print(num)
        count += 1

        if count == num {
            break printLoop
        }
    }

    removeLoop: while true {
        if numbers.first != num {
            break numbersLoop
        }
        numbers.removeFirst()
    }
}