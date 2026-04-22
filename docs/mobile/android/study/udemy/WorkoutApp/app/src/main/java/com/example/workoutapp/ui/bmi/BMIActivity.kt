package com.example.workoutapp.ui.bmi

import android.os.Bundle
import android.widget.Toast
import com.example.workoutapp.databinding.ActivityBmiBinding
import com.example.workoutapp.data.bmi.BMI
import androidx.databinding.DataBindingUtil
import com.example.workoutapp.R
import com.example.workoutapp.data.bmi.UNIT_TYPE
import com.example.workoutapp.ui.BaseActivity
import com.example.workoutapp.utils.extensions.invisible
import com.example.workoutapp.utils.extensions.visible

class BMIActivity : BaseActivity() {

    private lateinit var binding: ActivityBmiBinding
    private var currentUnit: UNIT_TYPE = UNIT_TYPE.METRIC

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        initSupportActionBar()

        binding.rgUnits.setOnCheckedChangeListener { group, checkedId ->
            if (checkedId == R.id.rbMetricUnits) {
                currentUnit = UNIT_TYPE.METRIC
                binding.etMetricUnitHeight.text!!.clear()
                binding.etMetricUnitWeight.text!!.clear()
            } else {
                currentUnit = UNIT_TYPE.US
                binding.etUsMetricUnitWeight.text!!.clear()
                binding.etUsMetricUnitHeightFeet.text!!.clear()
                binding.etUsMetricUnitHeightInch.text!!.clear()
            }
            binding.isMetric = currentUnit == UNIT_TYPE.METRIC
            binding.llDiplayBMIResult.invisible()
        }

        binding.btnCalculateUnits.setOnClickListener {
            calculateUnits()
        }
    }

    override fun initViewBinding() {
        binding = DataBindingUtil.setContentView(this, R.layout.activity_bmi)
        binding.isMetric = true
    }

    private fun initSupportActionBar() {
        setSupportActionBar(binding.toolbarBmiActivity)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "CALCULATE BMI"
    }

    private fun calculateUnits() {
        if (validateUnits()) {
            val weightValue: Float
            val heightValue: Float
            if (currentUnit == UNIT_TYPE.METRIC) {
                weightValue = binding.etMetricUnitWeight.text.toString().toFloat()
                heightValue = binding.etMetricUnitHeight.text.toString().toFloat() / 100 // cm to meter
            } else {
                weightValue = binding.etUsMetricUnitWeight.text.toString()
                    .toFloat()
                val usUnitHeightValueFeet: String = binding.etUsMetricUnitHeightFeet.text.toString()
                val usUnitHeightValueInch: String = binding.etUsMetricUnitHeightInch.text.toString()
                // Here the Height Feet and Inch values are merged and multiplied by 12 for converting it to inches.
                heightValue =
                    usUnitHeightValueInch.toFloat() + usUnitHeightValueFeet.toFloat() * 12
            }
            binding.bmi = BMI(height = heightValue, weight = weightValue, currentUnit)
            binding.llDiplayBMIResult.visible()
        } else {
            Toast.makeText(this@BMIActivity, "Please enter valid values.", Toast.LENGTH_SHORT)
                .show()
        }
    }

    private fun validateUnits(): Boolean {
        if (currentUnit == UNIT_TYPE.METRIC) {
            var isValid = true
            when {
                binding.etMetricUnitWeight.text.toString().isEmpty() -> {
                    isValid = false
                }
                binding.etMetricUnitHeight.text.toString().isEmpty() -> {
                    isValid = false
                }
            }
            return isValid
        } else {
            var isValid = true
            when {
                binding.etMetricUnitWeight.text.toString().isEmpty() -> {
                    isValid = false
                }
                binding.etUsMetricUnitHeightFeet.text.toString().isEmpty() -> {
                    isValid = false
                }
                binding.etUsMetricUnitHeightInch.text.toString().isEmpty() -> {
                    isValid = false
                }
            }
            return isValid
        }
    }
}