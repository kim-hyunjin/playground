package com.example.workoutapp.ui.main

import android.content.Intent
import android.os.Bundle
import com.example.workoutapp.ui.bmi.BMIActivity
import com.example.workoutapp.ui.exercise.ExerciseActivity
import com.example.workoutapp.ui.history.HistoryActivity
import com.example.workoutapp.databinding.ActivityMainBinding
import com.example.workoutapp.ui.BaseActivity

class MainActivity : BaseActivity() {
    private lateinit  var binding: ActivityMainBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding.flStart.setOnClickListener {
            val intent = Intent(this, ExerciseActivity::class.java)
            startActivity(intent)
        }
        binding.flBMI.setOnClickListener {
            val intent = Intent(this, BMIActivity::class.java)
            startActivity(intent)
        }
        binding.flHistory.setOnClickListener {
            val intent = Intent(this, HistoryActivity::class.java)
            startActivity(intent)
        }
    }

    override fun initViewBinding() {
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }

}