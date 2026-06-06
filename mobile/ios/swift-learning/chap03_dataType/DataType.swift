
// 정수
print("""
    int max: \(Int.max) \n
    int8 max: \(Int8.max) \n
    int16 max: \(Int16.max) \n
    int32 max: \(Int32.max) \n
    int64 max: \(Int64.max) \n
    uint max: \(UInt.max) \n
    uint8 max: \(UInt8.max) \n
    uint16 max: \(UInt16.max) \n
    uint32 max: \(UInt32.max) \n
    uint64 max: \(UInt64.max) \n
    """)

// boolean
var bool: Bool = true
print("bool: \(bool)")
bool.toggle()
print("atfer bool.toggle(): \(bool)")
    
// 부동소수점
var floatValue: Float = 1234567890.1
let doubleValue: Double = 1234567890.1

print("floatValue: \(floatValue), doubleValue: \(doubleValue)")

floatValue = 123456.1

print("floatValue: \(floatValue), doubleValue: \(doubleValue)")
var randInt = Int.random(in: -100...100)
print("randInt: \(randInt)")

// 문자
let alphabetA: Character = "A"
print(alphabetA)
let commandCharacter: Character = "😀"
print(commandCharacter)

let 한글변수이름: Character = "ㄱ"
print("한글의 첫 자음: \(한글변수이름)")

// 문자열
let name: String = "hyunjin"
var introduce: String = String() // 이니셜라이저를 사용해 빈 문자열 생성가능
// + 연산자를 통해서도 이어붙일 수 있다.
introduce.append("제 이름은")
introduce = introduce + " " + name + "입니다."
print(introduce)

print("글자 수 세기 : \(name.count)")
print("빈 문자열인지 체크 : \(introduce.isEmpty)")

// 유니코드의 스칼라값을 사용하면 값에 해당하는 표현이 출력
let unicodeScalarValue: String = "\u{2665}"

var isSameString: Bool = false

isSameString = name == "hyunjin"
print(isSameString) // true

isSameString = name == "HYUNJIN"
print(isSameString) // false

var hasPrefix: Bool = false
hasPrefix = name.hasPrefix("hyun")
print(hasPrefix) // true
hasPrefix = introduce.hasPrefix("제 이름은")
print(hasPrefix) // true

var hasSuffix: Bool = false
hasSuffix = name.hasSuffix("jin")
print(hasSuffix) // true

var convertedString: String = ""
convertedString = name.uppercased()
convertedString = name.lowercased()
print(name.count)
