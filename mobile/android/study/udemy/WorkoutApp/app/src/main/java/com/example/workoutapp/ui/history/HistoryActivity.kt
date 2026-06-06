package com.example.workoutapp.ui.history

import android.os.Bundle
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.workoutapp.WorkOutApp
import com.example.workoutapp.data.history.HistoryEntity
import com.example.workoutapp.databinding.ActivityHistoryBinding
import com.example.workoutapp.ui.BaseActivity
import com.example.workoutapp.utils.extensions.visibleIf
import kotlinx.coroutines.launch

class HistoryActivity: BaseActivity() {

    private lateinit var binding: ActivityHistoryBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        initSupportActionBar()
        initHistoryDataView()
    }

    override fun initViewBinding() {
        binding = ActivityHistoryBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }

    private fun initSupportActionBar() {
        setSupportActionBar(binding.toolbarHistoryActivity)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "HISTORY"
    }

    private fun initHistoryDataView() {
        val historyDao = (application as WorkOutApp).db.historyDao()

        lifecycleScope.launch {
            historyDao.fetchALLDates().collect {
                val isDataExist = it.isNotEmpty()

                setHistoryDataViewVisibility(isDataExist)

                if (isDataExist) {
                    setHistoryDataRecyclerView(it)
                }

            }
        }
    }

    private fun setHistoryDataViewVisibility(isDataExist: Boolean) {
        binding.tvHistory visibleIf isDataExist
        binding.rvHistory visibleIf isDataExist
        binding.tvNoDataAvailable visibleIf isDataExist
    }

    private fun setHistoryDataRecyclerView(entities: List<HistoryEntity>) {
        binding.rvHistory.layoutManager = LinearLayoutManager(this@HistoryActivity)

        val dates = ArrayList<String>(entities.map { historyEntity -> historyEntity.date }.toList())
        val historyAdapter = HistoryAdapter(dates)
        binding.rvHistory.adapter = historyAdapter
    }
}