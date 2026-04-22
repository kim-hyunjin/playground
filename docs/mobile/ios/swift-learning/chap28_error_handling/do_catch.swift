/*
    스위프트에서 오류는 Error라는 프로토콜을 준수하는 타입의 값을 통해 표현된다.
    Error프로토콜은 사실상 빈 프로토콜이지만 오류를 표현하기 위한 타입(주로 열거형)은 이 프로토콜을 채택한다.
*/
enum VendingMachineError: Error {
    case invalidSelection
    case insufficientFunds(coinsNeeded: Int)
    case outOfStock
}
// 오류를 던질 때는 throw 구문을 사용한다.

/*
    오류 포착 및 처리
    오류를 처리하기 위한 네 가지 방법
    - 함수에서 발생한 오류를 해당 함수를 호출한 코드에 알리는 방법
    - do-catch 구문을 이용하여 오류를 처리하는 방법
    - 옵셔널 값으로 오류를 처리하는 방법
    - 오류가 발생하지 않을 것이라고 확신하는 방법
*/

// 함수에서 발생한 오류를 해당 함수를 호출한 코드에 알리는 방법
// try 키워드로 던져진 오류를 받을 수 있다. - 키워드는 try, try? try! 등
// 함수, 메서드, 이니셜라이저의 매개변수 뒤에 throws 키워드를 사용하면 해당 함수, 메서드, 이니셜라이저는 오류를 던질 수 있다.

/*
    throws 함수나 메서드는 같은 이름의 throws가 명시되지 않는 함수나 메서드와 구분된다.
    throws를 포함한 함수, 메서드, 이니셜라이저는 일반 함수, 메서드, 이니셜라이저로 재정의할 수 없다.
    그 반대는 가능
*/

struct Item {
    var price: Int
    var count: Int
}

class VendingMachine {
    var inventory = [
        "Candy Bar": Item(price: 12, count: 7),
        "Chips": Item(price: 10, count: 4),
        "Biscuit": Item(price: 7, count: 11)
    ]
    var coinsDeposited = 0

    func dispense(snack: String) {
        print("\(snack) 제공")
    }

    func vend(itemNamed name: String) throws {
        guard let item = self.inventory[name] else {
            throw VendingMachineError.invalidSelection
        }
        guard item.count > 0 else {
            throw VendingMachineError.outOfStock
        }
        guard item.price <= self.coinsDeposited else {
            throw VendingMachineError.insufficientFunds(
                coinsNeeded: item.price - self.coinsDeposited
            )
        }

        self.coinsDeposited -= item.price
        var newItem = item
        newItem.count -= 1
        self.inventory[name] = newItem
        self.dispense(snack: name)
    }
}

let favoriteSnacks = [
    "yagom": "Chips",
    "hyunjin": "Biscuit",
    "iu": "Chocolate"
]

// func buyFavoriteSnack(person: String, vendingMachine: VendingMachine) throws {
//     let snackName = favoriteSnacks[person] ?? "Candy Bar"
//     try vendingMachine.vend(itemNamed: snackName)
// }

// struct PurchasedSnack {
//     let name: String

//     init(name: String, vendingMachine: VendingMachine) throws {
//         try vendingMachine.vend(itemNamed: name)
//         self.name = name
//     }
// }

// let machine: VendingMachine = VendingMachine()
// machine.coinsDeposited = 30

// var purchase: PurchasedSnack = try PurchasedSnack(name: "Biscuit", vendingMachine: machine)
// print(purchase.name)

// for (person, favoriteSnack) in favoriteSnacks {
//     print(person, favoriteSnack)
//     try buyFavoriteSnack(person: person, vendingMachine: machine)
// }


func buyFavoriteSnack(person: String, vendingMachine: VendingMachine) {
    let snackName = favoriteSnacks[person] ?? "Candy Bar"
    tryingVend(itemNamed: snackName, vendingMachine: vendingMachine)
}

struct PurchasedSnack {
    let name: String

    init(name: String, vendingMachine: VendingMachine) {
        tryingVend(itemNamed: name, vendingMachine: vendingMachine)
        self.name = name
    }
}

let machine: VendingMachine = VendingMachine()
machine.coinsDeposited = 30

var purchase: PurchasedSnack = PurchasedSnack(name: "Biscuit", vendingMachine: machine)
print(purchase.name)

for (person, favoriteSnack) in favoriteSnacks {
    print(person, favoriteSnack)
    buyFavoriteSnack(person: person, vendingMachine: machine)
}

// do-catch 로 처리하기
// catch 뒤에 오류의 종류를 명시하지 않으면 블록 내부에 암시적으로 error라는 이름의 지역 상수가 들어온다.
func tryingVend(itemNamed: String, vendingMachine: VendingMachine) {
    do {
        try vendingMachine.vend(itemNamed: itemNamed)
    } catch VendingMachineError.invalidSelection {
        print("유호하지 않은 선택")
    } catch VendingMachineError.outOfStock {
        print("품절")
    } catch VendingMachineError.insufficientFunds(let coinsNeeded) {
        print("자금부족 \(coinsNeeded)개를 추가로 지급해주세요.")
    } catch {
        print("그 외 오류 발생: ", error)
    }
}