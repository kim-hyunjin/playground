package com.github.kimhyunjin.contentresolverexam

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.github.kimhyunjin.contentresolverexam.databinding.ActivityMainBinding
import java.text.SimpleDateFormat
import java.util.Date

class MainActivity : AppCompatActivity() {
    private val binding: ActivityMainBinding by lazy {
        ActivityMainBinding.inflate(layoutInflater)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(binding.root)

        val contentResolverHelper = MyContentResolverHelper(this)
        val sdf = SimpleDateFormat("HH:mm:ss")

        // A앱 리스트 불러오기
        binding.btnQuery.setOnClickListener {

            // RoomDatabase 모두 불러오기
            val list = contentResolverHelper.getAllItems()
            binding.resultTextView.text = list.toString()
        }

        // A앱 Item 추가
        binding.btnAdd.setOnClickListener {

            // RoomDatabase Insert
            contentResolverHelper.insertItem("*외부*", "Content - ${sdf.format(Date())}")

            Toast.makeText(this, "Add!", Toast.LENGTH_SHORT).show()
        }

        // A앱 커스텀 메서드 호출
        binding.btnCustomMethod.setOnClickListener {

            // 커스텀 메서드 호출
            val message = contentResolverHelper.customMethod()

            Toast.makeText(this, "message : $message", Toast.LENGTH_SHORT).show()
        }
    }
}