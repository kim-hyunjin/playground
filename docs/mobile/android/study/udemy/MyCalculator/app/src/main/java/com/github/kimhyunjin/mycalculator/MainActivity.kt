package com.github.kimhyunjin.mycalculator

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.TextView
import java.lang.ArithmeticException
import java.util.regex.Pattern

class MainActivity : AppCompatActivity() {

    private var tvInput: TextView? = null


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        tvInput = findViewById(R.id.tv_input)
    }

    fun onDigit(view: View) {
        tvInput?.append((view as Button).text)
    }

    @Suppress("UNUSED_PARAMETER")
    fun onClear(view: View) {
        tvInput?.text = ""
    }

    @Suppress("UNUSED_PARAMETER")
    fun onDecimalPoint(view: View) {
        if (tvInput == null) return
        if (tvInput!!.text.isEmpty()) return
        if (tvInput!!.text.contains(("."))) {
            val tvValue = tvInput!!.text.toString()
            if (!isEndWithDigit(tvValue)) return

            val dotIndex = tvValue.lastIndexOf(".")
            val operationIndex: Int =
                if (tvValue.contains("/")) {
                    tvValue.indexOf("/")
                } else if (tvValue.contains("*")) {
                    tvValue.indexOf("*")
                } else if (tvValue.contains("+")) {
                    tvValue.indexOf("+")
                } else if (tvValue.contains("-")) {

                    if (tvValue.startsWith("-")) {
                        tvValue.substring(1).indexOf("-") + 1
                    } else {
                        tvValue.indexOf("-")
                    }

                } else {
                    -1
                }

            if (operationIndex == -1) return

            if (dotIndex > operationIndex) return
        }

        tvInput!!.append(("."))
    }

    fun onOperator(view: View) {
        tvInput?.text?.let {
            if (isOperatorIncluded(it.toString())) return

            tvInput?.append((view as Button).text)
        }
    }

    @Suppress("UNUSED_PARAMETER")
    fun onEqual(view: View) {
        if (tvInput == null) return

        var tvValue = tvInput!!.text.toString()

        if (!isEndWithDigit(tvValue)) return

        calculate(tvValue)
    }

    private fun calculate(inputString: String) {
        var prefix = ""

        var value = inputString

        if (value.startsWith("-")) {
            prefix = "-"
            value = value.substring(1)
        }

        val operator = getOperator(value) ?: return

        val splitValue = value.split(operator)
        val num1 = (prefix + splitValue[0]).toDouble()
        val num2 = splitValue[1].toDouble()

        try {

            var result: Double? = null
            when(operator) {
                "-" -> result = num1 - num2
                "+" -> result = num1 + num2
                "*" -> result = num1 * num2
                "/" -> result = num1 / num2
            }

            tvInput!!.text = removeZeroAfterDot(result.toString())

        } catch (e: ArithmeticException) {
            e.printStackTrace()
        }
    }

    private fun getOperator(value: String): String? {
        if (value.contains("-")) {
            return "-"
        }

        if (value.contains("+")) {
            return "+"
        }

        if (value.contains("/")) {
            return "/"
        }

        if (value.contains("*")) {
            return "*"
        }

        return null
    }

    private fun isOperatorIncluded(value: String): Boolean {
        return if (value.startsWith("-")) {
            value.contains(("/")) || value.contains("*") || value.contains("+")
        } else {
            value.contains(("/")) || value.contains("*") || value.contains("+") || value.contains("-")
        }
    }

    private fun isEndWithDigit(value: String): Boolean {
        return Pattern.compile("[0-9]$").matcher(value).find()
    }

    private fun removeZeroAfterDot(result: String): String {
        var value = result
        if (value.contains(".0")) {
            value = result.substring(0, result.length - 2)
        }
        return value
    }
}