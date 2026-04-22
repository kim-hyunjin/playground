//
//  CalculatorBrain.swift
//  BMI Calculator
//
//  Created by KinHyunJin on 1/19/25.
//  Copyright © 2025 Angela Yu. All rights reserved.
//

import UIKit

struct CalculatorBrain {
    var bmi: BMI?
    
    var formattedBmiValue: String {
        get {
            return String(format: "%.1f", bmi?.value ?? 0.0)
        }
   }
    
    mutating func calculateBMI(height: Float, weight: Float) {
        let bmiValue = weight / pow(height, 2)
        
        if bmiValue < 18.5 {
            bmi = BMI(value: bmiValue, advice: "Eat more!", color: UIColor.blue)
        } else if bmiValue < 24.9 {
            bmi = BMI(value: bmiValue, advice: "Good!", color: UIColor.green)
        } else {
            bmi = BMI(value: bmiValue, advice: "Exercise!", color: UIColor.red)
        }
    }
    
    func getAdvice() -> String {
        return bmi?.advice ?? ""
    }
    
    func getColor() -> UIColor {
        return bmi?.color ?? UIColor.white
    }
}
