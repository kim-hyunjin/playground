package com.example.workoutapp.data.bmi

import java.math.BigDecimal
import java.math.RoundingMode

enum class UNIT_TYPE {
    METRIC,
    US
}
class BMI
/**
 * @param height unit - meter
 * @param weight: unit - kg
 */(height: Float, weight: Float, type: UNIT_TYPE) {
    val bmi: Float
    val bmiLabel: String
    val bmiDescription: String
    val displayBmiValue: String

    init {
        bmi = if (type == UNIT_TYPE.METRIC) {
            weight / (height * height)
        } else {
            // This is the Formula for US UNITS result.
            // Reference Link : https://www.cdc.gov/healthyweight/assessing/bmi/childrens_bmi/childrens_bmi_formula.html
            703 * (weight / (height * height))
        }

        // This is used to round the result value to 2 decimal values after "."
        displayBmiValue = BigDecimal(bmi.toDouble()).setScale(2, RoundingMode.HALF_EVEN).toString()
        if (bmi.compareTo(15f) <= 0) {
            bmiLabel = "Very severely underweight"
            bmiDescription = "Oops! You really need to take better care of yourself! Eat more!"

            // 15 < bmi <= 16
        } else if (bmi.compareTo(15f) > 0 && bmi.compareTo(16f) <= 0) {
            bmiLabel = "Severely underweight"
            bmiDescription = "Oops!You really need to take better care of yourself! Eat more!"

            // 16 < bmi <= 18.5
        } else if (bmi.compareTo(16f) > 0 && bmi.compareTo(18.5f) <= 0) {
            bmiLabel = "Underweight"
            bmiDescription = "Oops! You really need to take better care of yourself! Eat more!"

            // 18.5 < bmi <= 25
        } else if (bmi.compareTo(18.5f) > 0 && bmi.compareTo(25f) <= 0) {
            bmiLabel = "Normal"
            bmiDescription = "Congratulations! You are in a good shape!"

            // 25 < bmi <= 30
        } else if (bmi.compareTo(25f) > 0 && bmi.compareTo(30f) <= 0) {
            bmiLabel = "Overweight"
            bmiDescription = "Oops! You really need to take care of your yourself! Workout maybe!"

            // 30 < bmi <= 35
        } else if (bmi.compareTo(30f) > 0 && bmi.compareTo(35f) <= 0) {
            bmiLabel = "Obese Class | (Moderately obese)"
            bmiDescription = "Oops! You really need to take care of your yourself! Workout maybe!"

            // 35 < bmi <= 40
        } else if (bmi.compareTo(35f) > 0 && bmi.compareTo(40f) <= 0) {
            bmiLabel = "Obese Class || (Severely obese)"
            bmiDescription = "OMG! You are in a very dangerous condition! Act now!"

            // 40 < bmi
        } else {
            bmiLabel = "Obese Class ||| (Very Severely obese)"
            bmiDescription = "OMG! You are in a very dangerous condition! Act now!"
        }
    }
}