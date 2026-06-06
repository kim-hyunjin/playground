//
//  ViewController.swift
//  HelloWorld
//
//  Created by 김현진 on 2021/05/05.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet var lbllHello: UILabel!
    @IBOutlet var txtName: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }

    @IBAction func btnSend(_ sender: UIButton) {
        lbllHello.text = "Hello, " + txtName.text!
    }
    
}

