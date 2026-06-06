package com.example.happyplaces.activities

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.happyplaces.R
import com.example.happyplaces.databinding.ActivityMapBinding
import com.example.happyplaces.models.PlaceEntity

class MapActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMapBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMapBinding.inflate(layoutInflater)
        setContentView(binding.root)
        setSupportActionBar(binding.toolbarHappyMap)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        binding.toolbarHappyMap.setNavigationOnClickListener {
            onBackPressed()
        }

        var place: PlaceEntity? = null
        if (intent.hasExtra("place")) {
            place = intent.getParcelableExtra("place")
        }
        if (place != null) {
            supportActionBar?.title = place.location
            supportFragmentManager.beginTransaction().replace(R.id.fragment_container_view, MapsFragment(place)).commit()
        }
    }
}