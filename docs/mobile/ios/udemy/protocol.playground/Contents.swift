/*
class Bird {
    var isFemale = true
    
    func layEgg() {
        if isFemale {
            print("The bird has laid an egg.")
        }
    }
    
    func fly() {
        print("The bird is flying.")
    }
}

class Eagle: Bird {
    func soar() {
        print("The eagle is soaring high in the sky.")
    }
}


let myEagle = Eagle()
myEagle.fly()
myEagle.layEgg()
myEagle.soar()


class Penguin: Bird {
    func swim() {
        print("The penguin is swimming.")
    }
}


let myPenguin = Penguin()
myPenguin.fly() // oopsy, penguins can't fly
myPenguin.layEgg()
myPenguin.swim()

struct FlyingMuseum {
    func flyingDemo(flyingObject: Bird) {
        flyingObject.fly()
    }
}

let museum = FlyingMuseum()
museum.flyingDemo(flyingObject: myEagle) // 독수리와 펭귄 모두 비행 시연에 사용될 수 있습니다. 펭귄도 버드를 상속하고 있기 때문에. 펭귄은 날 수 없지만요..

class Airplane: Bird {
    override func fly() {
        print("The airplane uses its engines to fly.")
    }
} // 이렇게하면 비행기도 fly()를 호출해 날 수 있지만... 비행기는 새가 아니죠
*/
// 상속대신 프로토콜 사용하기

protocol CanFly {
    func fly()
}

extension CanFly {
    func fly() {
        print("The object is flying.")
    }
}

class Bird: CanFly {
    var isFemale = true
    
    func layEgg() {
        if isFemale {
            print("The bird has laid an egg.")
        }
    }
    
    func fly() {
        print("The bird is flying.")
    }
}

class Eagle: Bird {
    
    override func fly() {
        print("The eagle is flying.")
    }
    
    func soar() {
        print("The eagle is soaring high in the sky.")
    }
}

class Penguin: Bird { // 펭귄은 날 수 없기 때문에 CanFly 프로토콜을 따르지 않음
    func swim() {
        print("The penguin is swimming.")
    }
}

class Airplane: CanFly { // Bird를 상속하지 않고 CanFly 프로토콜을 따름
    func fly() {
        print("The airplane uses its engines to fly.")
    }
}

struct FlyingMuseum {
    func flyingDemo(flyingObject: CanFly) { // CanFly 프로토콜을 따르는 객체만 flyingDemo에 전달할 수 있습니다.
        flyingObject.fly()
    }
}

let myEagle = Eagle()
let myPenguin = Penguin()
let myAirplane = Airplane()

let museum = FlyingMuseum()
museum.flyingDemo(flyingObject: myEagle) // 독수리 비행 시연
museum.flyingDemo(flyingObject: myAirplane) // 비행기 비행 시연
// museum.flyingDemo(flyingObject: myPenguin) // 펭귄 비행 시연은 불가
