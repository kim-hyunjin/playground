package com.github.kimhyunjin.foodmap

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.widget.SearchView
import androidx.recyclerview.widget.LinearLayoutManager
import com.github.kimhyunjin.foodmap.databinding.ActivityMainBinding
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.naver.maps.geometry.LatLng
import com.naver.maps.map.CameraAnimation
import com.naver.maps.map.CameraUpdate
import com.naver.maps.map.NaverMap
import com.naver.maps.map.OnMapReadyCallback
import com.naver.maps.map.overlay.Marker
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainActivity : AppCompatActivity(), OnMapReadyCallback {

    private lateinit var binding: ActivityMainBinding
    private var naverMap: NaverMap? = null
    private var recyclerViewAdapter: RestaurantListAdapter = RestaurantListAdapter {
        moveCamera(it, 17.0)
    }
    private var markerList = emptyList<Marker>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.mapView.onCreate(savedInstanceState)
        binding.mapView.getMapAsync(this)

        binding.bottomSheetLayout.searchResultRecyclerView.apply {
            adapter = recyclerViewAdapter
            layoutManager = LinearLayoutManager(context)
        }

        binding.searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                if (query.isNullOrEmpty()) return false

                searchWithQuery(query)
                return true
            }

            override fun onQueryTextChange(newText: String?): Boolean {

                return false
            }

        })


    }

    private fun searchWithQuery(query: String) {
        SearchRepository.getGoodRestaurant(query).enqueue(object : Callback<SearchResult> {
            override fun onResponse(call: Call<SearchResult>, response: Response<SearchResult>) {
                Log.i("search", response.body().toString())

                val searchItemList = response.body()?.items.orEmpty()
                if (searchItemList.isEmpty()) {
                    Toast.makeText(this@MainActivity, "검색 결과가 없습니다.", Toast.LENGTH_SHORT).show()
                    return
                } else if (naverMap == null) {
                    Toast.makeText(this@MainActivity, "오류가 발생했습니다.", Toast.LENGTH_SHORT).show()
                    return
                }

                removeMakersFromMap()
                markerList = searchItemList.map {
                    Marker(
                        it.getLanLng()
                    ).apply {
                        captionText = it.title
                        map = naverMap
                    }
                }

                Log.i("search", markerList.map { it.position }.toString())

                recyclerViewAdapter.setData(searchItemList)

                moveCamera(markerList.first().position, 13.0)
            }

            override fun onFailure(call: Call<SearchResult>, t: Throwable) {
                Toast.makeText(this@MainActivity, "오류가 발생했습니다.", Toast.LENGTH_SHORT).show()
                return
            }

        })
    }

    private fun moveCamera(latLng: LatLng, zoomLevel: Double) {
        val cameraUpdate = CameraUpdate.scrollAndZoomTo(latLng, zoomLevel)
            .animate(CameraAnimation.Easing)
        naverMap!!.moveCamera(cameraUpdate)
        collapseBottomSheet()
    }

    private fun collapseBottomSheet() {
        val bottomSheetBehavior = BottomSheetBehavior.from(binding.bottomSheetLayout.root)
        bottomSheetBehavior.state = BottomSheetBehavior.STATE_COLLAPSED
    }

    private fun removeMakersFromMap() {
        markerList.forEach {
            it.map = null
        }
    }

    override fun onStart() {
        super.onStart()
        binding.mapView.onStart()
    }

    override fun onResume() {
        super.onResume()
        binding.mapView.onResume()
    }

    override fun onPause() {
        super.onPause()
        binding.mapView.onPause()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        binding.mapView.onSaveInstanceState(outState)
    }

    override fun onStop() {
        super.onStop()
        binding.mapView.onStop()
    }

    override fun onDestroy() {
        super.onDestroy()
        binding.mapView.onDestroy()
    }

    override fun onLowMemory() {
        super.onLowMemory()
        binding.mapView.onLowMemory()
    }

    override fun onMapReady(naverMap: NaverMap) {
        this.naverMap = naverMap

        val cameraUpdate = CameraUpdate.scrollTo(LatLng(37.5666102, 126.9783881))
            .animate(CameraAnimation.Easing)
        naverMap.moveCamera(cameraUpdate)
    }

}