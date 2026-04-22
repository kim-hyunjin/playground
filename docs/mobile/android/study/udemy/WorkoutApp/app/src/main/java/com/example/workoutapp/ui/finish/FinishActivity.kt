package com.example.workoutapp.ui.finish

import android.os.Bundle
import androidx.lifecycle.lifecycleScope
import com.example.workoutapp.WorkOutApp
import com.example.workoutapp.data.history.HistoryEntity
import com.example.workoutapp.databinding.ActivityFinishBinding
import com.example.workoutapp.ui.BaseActivity
import com.example.workoutapp.utils.extensions.toStringFormat
import kotlinx.coroutines.launch
import java.util.Calendar

class FinishActivity : BaseActivity() {
    private lateinit var binding: ActivityFinishBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        initSupportActionBar()

        binding.btnFinish.setOnClickListener {
            finish()
        }

        addDateToDatabase()
    }

    override fun initViewBinding() {
        binding = ActivityFinishBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }

    private fun initSupportActionBar() {
        setSupportActionBar(binding.toolbarFinishActivity)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
    }

    private fun addDateToDatabase() {
        val historyDao = (application as WorkOutApp).db.historyDao()
        val dateTime = Calendar.getInstance().time

        lifecycleScope.launch {
            historyDao.insert(HistoryEntity(date = dateTime.toStringFormat()))
        }
    }
}