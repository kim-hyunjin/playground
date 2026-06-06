package com.github.kimhyunjin.widgetsratingbar

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.github.kimhyunjin.widgetsratingbar.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private val binding by lazy { ActivityMainBinding.inflate(layoutInflater) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(binding.root)
        binding.ratingBar.rating = 2.5F
        binding.ratingBar.setOnRatingBarChangeListener {ratingBar, rating, fromUser ->
            binding.textView.text = "$rating"
        }
    }
}