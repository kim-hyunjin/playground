//
//  ViewController.swift
//  Tipsy
//
//  Created by Angela Yu on 09/09/2019.
//  Copyright © 2019 The App Brewery. All rights reserved.
//

import UIKit

class CalculatorViewController: UIViewController {

    @IBOutlet weak var billTextField: UITextField!
    @IBOutlet weak var zeroPctButton: UIButton!
    @IBOutlet weak var tenPctButton: UIButton!
    @IBOutlet weak var twentyPctButton: UIButton!
    @IBOutlet weak var splitNumberLabel: UILabel!
    
    var selectedTip: Double = 10.0
    var numberOfPeople: Int = 2
    var totalPerPerson: Double = 0.0
    var totalBill: Double = 0.0
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // 키보드 바깥 탭 시 dismiss
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(dismissKeyboard))
        view.addGestureRecognizer(tapGesture)
    }

    @objc func dismissKeyboard() {
        view.endEditing(true)
    }

    
    @IBAction func tipChanged(_ sender: UIButton) {
        zeroPctButton.isSelected = sender.currentTitle == "0%"
        tenPctButton.isSelected = sender.currentTitle == "10%"
        twentyPctButton.isSelected = sender.currentTitle == "20%"
        selectedTip = Double(sender.currentTitle!.dropLast())! / 100
    }
    
    @IBAction func stepperValueChanged(_ sender: UIStepper) {
        let value = Int(sender.value)
        numberOfPeople = value
        splitNumberLabel.text = "\(value)"
    }
    
    @IBAction func calculatePressed(_ sender: UIButton) {
        let bill = Double(billTextField.text!) ?? 0.0
        let tipAmount = bill * selectedTip
        totalBill = bill + tipAmount
        totalPerPerson = totalBill / Double(numberOfPeople)
        performSegue(withIdentifier: "goToResults", sender: self)
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "goToResults" {
            let destinationVC = segue.destination as! ResultsViewController
            destinationVC.total = String(format: "%.2f", totalPerPerson)
            destinationVC.setting = "Split between \(numberOfPeople) people, with \(Int(selectedTip))% tip."
        }
            
    }
        
    
}

