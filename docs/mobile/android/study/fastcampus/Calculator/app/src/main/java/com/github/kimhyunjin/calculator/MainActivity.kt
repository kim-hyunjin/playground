package com.github.kimhyunjin.calculator

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.Toast
import com.github.kimhyunjin.calculator.databinding.ActivityMainBinding
import java.math.BigDecimal
import java.text.DecimalFormat

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private val number1 = StringBuilder()
    private val number2 = StringBuilder()
    private val op = StringBuilder()
    private val decimalFormat = DecimalFormat("#,###")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }

    fun numberClicked(view: View) {
        val numberString = (view as? Button)?.text.toString() ?: ""

        val result = if (op.isEmpty()) number1 else number2
        result.append(numberString)
        updateEquationTextView()
    }

    fun clearClicked(view: View) {
        number1.clear()
        number2.clear()
        op.clear()
        updateEquationTextView()
        binding.resultTextView.text = ""
    }

    fun equalClicked(view: View) {
        if (op.isEmpty()) {
            Toast.makeText(this, "올바르지 않은 수식입니다.", Toast.LENGTH_SHORT).show()
        }
        val num1 = if (number1.isEmpty()) BigDecimal(0) else number1.toString().toBigDecimal()
        val num2 = if (number2.isEmpty()) BigDecimal(0) else number2.toString().toBigDecimal()

        val result = if (op.toString().equals("+")) {
            decimalFormat.format(num1 + num2)
        } else {
            decimalFormat.format(num1 - num2)
        }

        number1.clear()
        number2.clear()
        op.clear()
        binding.resultTextView.text = result.toString()
    }

    fun opClicked(view: View) {
        val opString = (view as? Button)?.text.toString() ?: ""

        if (number1.isEmpty()) {
            val resultViewText = binding.resultTextView.text.toString()
            if (resultViewText.isNotEmpty()) {
                number1.append(resultViewText.replace(",", ""))
            } else {
                number1.append("0")
            }
        }

        if (number2.isNotEmpty()) {
            Toast.makeText(this, "한 개의 연산자만 사용할 수 있습니다.", Toast.LENGTH_SHORT).show()
            return
        }
        if (op.isNotEmpty()) {
            op.clear()
        }
        op.append(opString)
        updateEquationTextView()
    }

    private fun updateEquationTextView() {
        val formattedNum1 = if (number1.isNotEmpty()) decimalFormat.format(
            number1.toString().toBigDecimal()
        ) else ""
        val formattedNum2 = if (number2.isNotEmpty()) decimalFormat.format(
            number2.toString().toBigDecimal()
        ) else ""
        binding.equationTextView.text = "$formattedNum1 $op $formattedNum2"
    }
}