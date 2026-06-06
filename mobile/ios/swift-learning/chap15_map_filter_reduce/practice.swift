enum Gender {
    case male, female, unknown
}

struct Friend {
    let name: String
    let gender: Gender
    let location: String
    var age: UInt
}

var friends: [Friend] = [Friend]()

friends.append(Friend(name: "hyunjin", gender: .male, location: "서울", age: 29))
friends.append(Friend(name: "max", gender: .male, location: "서울", age: 21))
friends.append(Friend(name: "hamilton", gender: .male, location: "서울", age: 33))
friends.append(Friend(name: "ferez", gender: .male, location: "서울", age: 25))
friends.append(Friend(name: "yap", gender: .male, location: "부산", age: 32))
friends.append(Friend(name: "khan", gender: .male, location: "김포", age: 33))
friends.append(Friend(name: "bom", gender: .female, location: "서울", age: 35))

var result: [Friend] = friends
    .map{ Friend(name: $0.name, gender: $0.gender, location: $0.location, age: $0.age + 1) }
    .filter{ $0.age >= 25 && $0.location != "서울" }

var string: String = result.reduce("서울 외 지역에 거주하며 나이가 25세 이상인 친구") {
        $0 + "\n" + "\($1.name), \($1.location), \($1.age)세"
    }

print(string)