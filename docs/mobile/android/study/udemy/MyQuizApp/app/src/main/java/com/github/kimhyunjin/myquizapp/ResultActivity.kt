package com.github.kimhyunjin.myquizapp

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.TextView

class ResultActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_result)

        val tvName: TextView = findViewById(R.id.tv_name)
        tvName.text = intent.getStringExtra(Constants.USER_NAME)

        val tvScore: TextView = findViewById(R.id.tv_score)
        tvScore.text = getString(R.string.tv_score, intent.getIntExtra(Constants.CORRECT_CNT, 0), intent.getIntExtra(Constants.TOTAL_CNT, 0))

        val btnFinish: Button = findViewById(R.id.btn_finish)
        btnFinish.setOnClickListener {
            startActivity(Intent(this, MainActivity::class.java))
        }
    }
}