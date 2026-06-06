package com.example.widgetsedittext

import android.graphics.Color
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import androidx.core.widget.addTextChangedListener
import com.example.widgetsedittext.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private val binding by lazy { ActivityMainBinding.inflate(layoutInflater) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(binding.root)

        binding.editText.addTextChangedListener {
            Log.d("EditText", "현재 입력된 값 = ${it.toString()}")
            if (it.toString().length >= 8) {
                binding.textView.text = "올바른 입력값입니다."
                binding.textView.setTextColor(Color.GREEN)
            } else {
                binding.textView.text = getString(R.string.textViewMsg)
                binding.textView.setTextColor(Color.BLACK)
            }
        }
    }
}