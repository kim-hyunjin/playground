package com.example.myapplication

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle

/* activity_main.xml 파일을 안드로이드가 자동으로 변환한 것 */
import com.example.myapplication.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 뷰 바인딩 사용하기 위해 아래 설정이 필을요하다.
        val binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnSay.setOnClickListener {
            binding.textSay.text = "Hello Kotlin!"
        }
    }
}