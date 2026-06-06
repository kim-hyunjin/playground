import UIKit

extension Double {
    func round(to places: Int) -> Double {
        let divisor = pow(10.0, Double(places))
        return (self * divisor).rounded() / divisor
    }
}

var myDouble: Double = 3.14159

myDouble.round(to: 3)

let button = UIButton(frame: CGRect(x: 100, y: 100, width: 200, height: 50))
button.backgroundColor = .blue
button.layer.cornerRadius = 25
button.clipsToBounds = true

extension UIButton {
    func makeCircular() {
        self.layer.cornerRadius = self.frame.size.width / 2
        self.clipsToBounds = true
    }
}

let button2 = UIButton(frame: CGRect(x: 0, y: 0, width: 100, height: 100))
button2.backgroundColor = .red
button2.makeCircular()
