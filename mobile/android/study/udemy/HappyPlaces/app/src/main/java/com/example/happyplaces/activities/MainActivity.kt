package com.example.happyplaces.activities

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.ItemTouchHelper
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.happyplaces.HappyPlaceApp
import com.example.happyplaces.adapters.HappyPlaceAdapter
import com.example.happyplaces.databinding.ActivityMainBinding
import com.example.happyplaces.models.PlaceDao
import com.example.happyplaces.models.PlaceEntity
import com.example.happyplaces.utils.SwipeToDeleteCallback
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var placeDao: PlaceDao
    private lateinit var adapter: HappyPlaceAdapter
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.fabAddHappyPlace.setOnClickListener {
            val intent = Intent(this, AddHappyPlaceActivity::class.java)
            startActivity(intent)
        }

        placeDao = (application as HappyPlaceApp).db.placeDao()

        initHappyPlacesView()
    }

    private fun initHappyPlacesView() {
        val placeDao = (application as HappyPlaceApp).db.placeDao()

        // 아래 코틀린 스코프를 사용하는 부분은 어떻게 짜야 베스트인지 모르겠다..
        lifecycleScope.launch(Dispatchers.IO) {
            placeDao.fetchAllPlace().collect {
                val isDataExist = it.isNotEmpty()

                runOnUiThread {
                    if (isDataExist) {
                        setupHappyPlaceRecyclerView(it)
                        binding.rvHappyPlaceList.visibility = View.VISIBLE
                        binding.tvNoPlaceData.visibility = View.GONE
                    } else {
                        binding.rvHappyPlaceList.visibility = View.GONE
                        binding.tvNoPlaceData.visibility = View.VISIBLE
                    }
                }

            }
        }
    }

    private fun setupHappyPlaceRecyclerView(places: List<PlaceEntity>) {
        binding.rvHappyPlaceList.layoutManager = LinearLayoutManager(this)
        adapter = HappyPlaceAdapter(places, handleClickPlace)
        binding.rvHappyPlaceList.adapter = adapter
        ItemTouchHelper(object: SwipeToDeleteCallback(this) {
            override fun onSwiped(viewHolder: RecyclerView.ViewHolder, direction: Int) {
                lifecycleScope.launch(Dispatchers.IO) {
                    placeDao.delete(adapter.getData()[viewHolder.layoutPosition])
                }
                adapter.notifyItemRemoved(viewHolder.layoutPosition)
            }
        }).attachToRecyclerView(binding.rvHappyPlaceList)
    }

    private val handleClickPlace: (Int, PlaceEntity) -> Unit = { position, place ->
        run {
            val intent = Intent(this@MainActivity, HappyPlaceDetailActivity::class.java)
            Log.i("click!", "$position : ${place.title}")
            intent.putExtra("place", place)
            startActivity(intent)
        }
    }

}