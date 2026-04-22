/*
    반환 타입에 불명확 타입(Opaque Types)을 사용하면 반환할 타입의 정확한 타입을 알려주지 않은 채로
    반환하겠다는 뜻이다.

    프로퍼티나 서브스크립트의 선언 혹은 함수의 반환 타입 위치에 프로토콜을 쓰면서 some을 붙이면
    이 프로토콜을 준수하는 어떤 타입 중에 하나일 것은 분명하다는 뜻이다.

    제네릭과 비교하자면, 제네릭은 외부에서 타입을 지정해주는 것이고, 
    불명확 타입은 내부에서 타입을 정해 내보내는것인데 밖에서는 정확히 어떤 타입인지는 몰라도
    쓸 수 있는 것이다. (역제네릭 타입Reverse Generic Type이라고 표현하기도 한다.)  
*/
protocol WrappedPrize {
    associatedtype Prize

    var wrapColor: String! {get}
    var prize: Prize! {get}
}

protocol Gundam {}
protocol Pokemon {}

struct WrappedGundam: WrappedPrize {
    var wrapColor: String!
    var prize: Gundam!
}
struct WrappedPokemon: WrappedPrize {
    var wrapColor: String!
    var prize: Pokemon!
}

// struct PrizeMachine {
//     func dispenseRandomPrize() -> WrappedPrize {
//         return WrappedGundam()
//     }
// }

// let machine: PrizeMachine = PrizeMachine()
// let wrappedPrize = machine.dispenseRandomPrize()
// error: protocol 'WrappedPrize' can only be used as a generic constraint because it has Self or associated type requirements
struct PrizeMachine {
    func dispenseRandomPrize() -> some WrappedPrize { // 불명확 타입으로 표현
        return WrappedGundam()
    }
}

let machine: PrizeMachine = PrizeMachine()
let wrappedPrize = machine.dispenseRandomPrize()