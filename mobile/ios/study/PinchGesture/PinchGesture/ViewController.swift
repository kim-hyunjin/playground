//
//  ViewController.swift
//  PinchGesture
//
//  Created by 김현진 on 2021/05/18.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet var imgPinch: UIImageView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        let pinch = UIPinchGestureRecognizer(target: self, action: #selector(ViewController.doPinch(_:)))
        self.view.addGestureRecognizer(pinch)
    }

    @objc func doPinch(_ pinch: UIPinchGestureRecognizer) {
        // 이미질ㄹ scale에 맞게 변환
        imgPinch.transform = imgPinch.transform.scaledBy(x: pinch.scale, y: pinch.scale)
        
        pinch.scale = 1 // 다음 변환을 위해 1로 설정
    }

}

