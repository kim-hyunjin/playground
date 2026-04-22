//
//  ViewController.swift
//  NavigationController
//
//  Created by 김현진 on 2021/05/08.
//

import UIKit

class ViewController: UIViewController, EditDelegate {

    
    @IBOutlet var txMessage: UITextField!
    @IBOutlet var imgView: UIImageView!
    let imgOn = UIImage(named: "lamp_on.png")
    let imgOff = UIImage(named: "lamp_off.png")
    var isOn: Bool = true {
        // isOn값이 바뀔때마다 이미지 변경하기
        didSet {
            if isOn {
                imgView.image = imgOn
            } else {
                imgView.image = imgOff
            }
        }
    }
    var isZoom: Bool = false {
        // isZoom값이 바뀔때마다 이미지 크기 변경하기
        didSet {
            guard oldValue != isZoom else {
                return
            }
            let scale: CGFloat = 2.0 // CGFloat은 Xcode에서 Float을 재정의한 자료형.
            var newWidth: CGFloat, newHeight: CGFloat
            if isZoom {
                newWidth = imgView.frame.width * scale
                newHeight = imgView.frame.height * scale
            } else {
                newWidth = imgView.frame.width / scale
                newHeight = imgView.frame.height / scale
            }
            imgView.frame.size = CGSize(width: newWidth, height: newHeight)
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        imgView.image = imgOn
    }
    
    // 세그웨이를 이용하여 화면을 전환하기 위해 prepare 함수 사용
    // 해당 세그웨이가 해당 뷰 컨트롤러로 전환되기 직전에 호출되는 함수. 데이터 전달을 위해 사용된다.
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let editViewController = segue.destination as! EditViewController
        if segue.identifier == "editButton" {
            editViewController.textWayValue = "segue: use button"
        } else if segue.identifier == "editBarButton" {
            editViewController.textWayValue = "segue: use bar button"
        }
        editViewController.textMessage = txMessage.text!
        // 대리자에게 자신을 전달
        editViewController.delegate = self
        editViewController.isOn = isOn
        editViewController.isZoom = isZoom
    }

    func didMessageEditDone(_ controller: EditViewController, message: String) {
        txMessage.text = message
    }
    
    func didImageOnOffDone(_ controller: EditViewController, isOn: Bool) {
        self.isOn = isOn
    }
    
    func didImageZoomDone(_ controller: EditViewController, isZoom: Bool) {
        self.isZoom = isZoom
    }
        

}

