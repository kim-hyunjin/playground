//
//  ViewController.swift
//  Alert
//
//  Created by 김현진 on 2021/05/08.
//

import UIKit

class ViewController: UIViewController {
    let imgLampOn = UIImage(named: "lamp-on.png")
    let imgLampOff = UIImage(named: "lamp-off.png")
    let imgLampRemove = UIImage(named: "lamp-remove.png")
    var isLampOn = true

    @IBOutlet var lampImg: UIImageView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        lampImg.image = imgLampOn
    }
    
    func setLampOn() {
        lampImg.image = imgLampOn
        isLampOn = true
    }
    func setLampOff() {
        lampImg.image = imgLampOff
        isLampOn = false
    }
    func setLampRemove() {
        lampImg.image = imgLampRemove
        isLampOn = false
    }

    @IBAction func btnLampOn(_ sender: UIButton) {
        if isLampOn {
            let lampOnAlert: UIAlertController = UIAlertController(title: "경고", message: "현재 On 상태입니다", preferredStyle: .alert)
            let onAction: UIAlertAction = UIAlertAction(title: "네, 알겠습니다.", style: .default, handler: nil)
            lampOnAlert.addAction(onAction)
            present(lampOnAlert, animated: true, completion: nil)
        } else {
            setLampOn()
        }
    }
    
    @IBAction func btnLampOff(_ sender: UIButton) {
        if isLampOn {
            let lampOffAlert: UIAlertController = UIAlertController(title: "램프 끄기", message: "정말 램프를 끄시겠습니까?", preferredStyle: .alert)
            let offAction: UIAlertAction = UIAlertAction(title: "네", style: .default, handler: { ACTION in
//                self.lampImg.image = self.imgLampOff
//                self.isLampOn = false
                self.setLampOff()
            })
            let cancelAttion: UIAlertAction = UIAlertAction(title: "아니오", style: .default, handler: nil)
            
            lampOffAlert.addAction(offAction)
            lampOffAlert.addAction(cancelAttion)
            
            present(lampOffAlert, animated: true, completion: nil)
        }
    }
    
    @IBAction func btnLampRemove(_ sender: UIButton) {
        let lampRemoveAlert: UIAlertController = UIAlertController(title: "램프 제거", message: "램프를 제거하시겠습니까?", preferredStyle: .alert)
        let offAction: UIAlertAction = UIAlertAction(title: "아니오, 끕니다(off)", style: .default, handler: { ACTION in self.setLampOff()
        })
        let onAction: UIAlertAction = UIAlertAction(title: "아니오, 켭니다(on)", style: .default, handler: { ACTION in self.setLampOn()
        })
        let removeAction: UIAlertAction = UIAlertAction(title: "네, 제거합니다.", style: .default, handler: { ACTION in self.setLampRemove()
        })
        
        lampRemoveAlert.addAction(offAction)
        lampRemoveAlert.addAction(onAction)
        lampRemoveAlert.addAction(removeAction)
        
        present(lampRemoveAlert, animated: true, completion: nil)
    }
}

