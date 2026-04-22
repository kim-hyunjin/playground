import UIKit

func calculator(n1: Int, n2: Int, operation: (Int, Int) -> Int) -> Int {
    return operation(n1, n2)
}

func add (_ n1: Int, _ n2: Int) -> Int {
    return n1 + n2
}

func subtract (_ n1: Int, _ n2: Int) -> Int {
    return n1 - n2
}

func multiply (_ n1: Int, _ n2: Int) -> Int {
    return n1 * n2
}

calculator(n1: 2, n2: 3, operation: add)
calculator(n1: 2, n2: 3, operation: subtract)
calculator(n1: 2, n2: 3, operation: multiply)

// closure
calculator(n1: 2, n2: 3, operation: { (n1: Int, n2: Int) -> Int in
    return n1 + n2
})
calculator(n1: 2, n2: 3, operation: { (n1, n2) in n1 * n2 })
calculator(n1: 2, n2: 3, operation: {$0 * $1})
calculator(n1: 2, n2: 3) { (n1: Int, n2: Int) -> Int in
    return n1 + n2
}

let array = [6, 2, 3, 9, 4, 1]

func addOne (number: Int) -> Int {
    return number + 1
}

array.map(addOne)
array.map({ (number: Int) -> Int in
    return number + 1
})
array.map({ number in
    return number + 1
})
array.map({ $0 + 1 })
