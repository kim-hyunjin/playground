//
//  EditViewController.swift
//  NavigationController
//
//  Created by 김현진 on 2021/05/08.
//

import UIKit

protocol EditDelegate {
    func didMessageEditDone(_ controller: EditViewController, message: String)
    func didImageOnOffDone(_ controller: EditViewController, isOn: Bool)
    func didImageZoomDone(_ controller: EditViewController, isZoom: Bool)
}

class EditViewController: UIViewController {
    
    var textWayValue: String = ""
    var textMessage: String = ""
    var delegate: EditDelegate?
    var isOn: Bool = false
    var isZoom: Bool = false {
        // isZoom값이 바뀔때마다 버튼의 타이틀 변경하기
        didSet {
            guard btnImgZoom != nil else {
                return
            }
            guard oldValue != isZoom else {
                return
            }
            
            setBtnImgZoomTitle()
        }
    }

    @IBOutlet var lblWay: UILabel!
    @IBOutlet var txMessage: UITextField!
    @IBOutlet var swlsOn: UISwitch!
    @IBOutlet var btnImgZoom: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        lblWay.text = textWayValue
        txMessage.text = textMessage
        swlsOn.isOn = isOn
        setBtnImgZoomTitle()
    }
    
    // 수정완료버튼을 눌렀을 때 수신자의 메소드를 호출해 위임업무 수행
    @IBAction func btnEditDone(_ sender: UIButton) {
        if delegate != nil {
            delegate?.didMessageEditDone(self, message: txMessage.text!)
            delegate?.didImageOnOffDone(self, isOn: isOn)
            delegate?.didImageZoomDone(self, isZoom: isZoom)
        }
        
        _ = navigationController?.popViewController(animated: true) // 이전 화면으로 돌아가기 위한 함수
    }
    
    @IBAction func swImageOnOff(_ sender: UISwitch) {
        isOn = sender.isOn
    }
    
    @IBAction func changeImgZoom(_ sender: UIButton) {
        isZoom = !isZoom
    }
    
    private func setBtnImgZoomTitle() {
        if isZoom {
            btnImgZoom.setTitle("확대", for: .normal)
        } else {
            btnImgZoom.setTitle("축소", for: .normal)
        }
    }
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}
