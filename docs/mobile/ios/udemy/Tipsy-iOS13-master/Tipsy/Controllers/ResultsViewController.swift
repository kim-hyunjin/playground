//
//  ResultsViewController.swift
//  Tipsy
//
//  Created by KinHyunJin on 4/4/25.
//  Copyright © 2025 The App Brewery. All rights reserved.
//

import UIKit

class ResultsViewController: UIViewController {

    @IBOutlet weak var totalLabel: UILabel!
    @IBOutlet weak var settingLabel: UILabel!
    
    var total: String?
    var setting: String?

    override func viewDidLoad() {
        super.viewDidLoad()
        totalLabel.text = total
        settingLabel.text = setting
    }
    
    @IBAction func recalculatePressed(_ sender: UIButton) {
        dismiss(animated: true, completion: nil)
    }
    


}
