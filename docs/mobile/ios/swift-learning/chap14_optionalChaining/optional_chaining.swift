// 옵셔널 체이닝은 옵셔널에 속해 있는 nil일지도 모르는 프로퍼티, 메서드, 서브스크립션 등을 가져오거나 호출할 때 사용할 수 있는 일련의 과정이다.
class Room {
    var number: Int

    init(number: Int) {
        self.number = number
    }
}

class Building {
    var name: String
    var room: Room?

    init(name: String) {
        self.name = name
    }
}

struct Address {
    var province: String
    var city: String
    var street: String
    var building: Building?
    var detailAddress: String?

    init(province: String, city: String, street: String) {
        self.province = province
        self.city = city
        self.street = street
    }

    func fullAddress() -> String? {
        var restAddress: String? = nil

        if let buildingInfo: Building = self.building {
            restAddress = buildingInfo.name
        } else if let detail = self.detailAddress {
            restAddress = detail
        }

        if let rest: String = restAddress {
            var fullAddress: String = self.province
            fullAddress += " " + self.city
            fullAddress += " " + self.street
            fullAddress += " " + rest

            return fullAddress
        } else {
            return nil
        }
    }

    func printAddress() {
        if let address: String = self.fullAddress() {
            print(address)
        } else {
            print("빌딩 주소 또는 상세 주소가 없습니다.")
        }
    }
}

class Person {
    var name: String
    var address: Address?

    init(name: String) {
        self.name = name
    }
}

let hyunjin: Person = Person(name: "hyunjin")
let hjRoom: Int? = hyunjin.address?.building?.room?.number // nil

var roomNumber: Int? = nil
if let hjAddress: Address = hyunjin.address {
    if let hjBuilding: Building = hjAddress.building {
        if let hjRoom: Room = hjBuilding.room {
            roomNumber = hjRoom.number
        }
    }
}
// 위 표현을 옵셔널 체이닝을 사용하면 훨씬 간단해진다.
if let roomNumber: Int = hyunjin.address?.building?.room?.number {
    print(roomNumber)
} else {
    print("방 번호가 없습니다.")
}
// 반대로 값을 할당할 수도 있다.
hyunjin.address?.building?.room?.number = 100 // address가 nil이므로 동작 도중에 중지될 것임

// 옵셔널 체이닝을 통해 메서드와 서브스크립트 호출도 가능하다.
hyunjin.address = Address(province: "서울특별시", city: "관악구", street: "땡땡로")
print(hyunjin.address?.fullAddress()?.isEmpty as Any) // nil
hyunjin.address?.printAddress()

// 서브스크립트를 가장 많이 사용하는 곳은 Array와 Dictionary다.
let optionalArray: [Int]? = [1, 2, 3]
print(optionalArray?[1] as Any) // 2

var optionalDict: [String: [Int]]? = [String: [Int]]()
optionalDict?["numberArray"] = optionalArray
print(optionalDict?["numberArray"]?[2] as Any) // 3

// 빠른 종료의 핵심 키워드는 guard이다. if 구문과 유사학세 Bool 타입의 값으로 동작한다.
// guard 뒤에 따라붙는 코드의 실행 결과가 true일 때 코드가 계속 실행된다.
// if 구문과는 다르게 guard 구문은 항상 else 구문이 뒤에 따라와야 한다.
// 이때 else 구문의 블록 내부에는 상위 코드 블록을 종료하는 코드가 들어가게 된다.
for i in 0...3 {
    guard i == 2 else {
        continue
    }
    print(i)
}

func greet(_ person: [String: String]) {
    guard let name: String = person["name"] else {
        return
    }
    // guard 구문 아래 코드부터 guard 구문에서 옵셔널 바인딩된 상수를 함수 내부 지역 상수처럼 사용할 수 있다.
    print("Hello \(name)")

    guard let location: String = person["location"] else {
        print("location 정보가 없습니다.")
        return
    }

    print("\(location)에는 날씨가 좋길 바랄게요")
}

var personInfo: [String: String] = [String: String]()
personInfo["name"] = "Jenny"
greet(personInfo)
personInfo["location"] = "jeju"
greet(personInfo)

struct Address2 {
    var province: String
    var city: String
    var street: String
    var building: Building?
    var detailAddress: String?

    init(province: String, city: String, street: String) {
        self.province = province
        self.city = city
        self.street = street
    }

    func fullAddress() -> String? {
        var restAddress: String? = nil

        if let buildingInfo: Building = self.building {
            restAddress = buildingInfo.name
        } else if let detail = self.detailAddress {
            restAddress = detail
        }
        // guard를 사용해 좀더 깔끔하게 표현
        guard let rest: String = restAddress else {
            return nil
        }

        var fullAddress: String = self.province
        fullAddress += " " + self.city
        fullAddress += " " + self.street
        fullAddress += " " + rest

        return fullAddress
    }

    func printAddress() {
        if let address: String = self.fullAddress() {
            print(address)
        } else {
            print("빌딩 주소 또는 상세 주소가 없습니다.")
        }
    }
}

func enterClub(name: String?, age: Int?) {
    guard let name: String = name, let age: Int = age, age > 19, name.isEmpty == false else { // ,는 &&로 치환해도 똑같다
        print("클럽에 들어갈 수 없는 나이입니다.")
        return
    }

    print("Welcome \(name)")
}

// guard 구문의 한계는 자신을 감싸는 블록이 없어 제어문 전환 명령어를 쓸 수 없는 상황이라면 사용이 불가하다는 점이다.