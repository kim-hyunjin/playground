package com.github.kimhyunjin.mygallery

import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.github.kimhyunjin.mygallery.databinding.ActivityAlbumBinding
import com.google.android.material.tabs.TabLayoutMediator

class AlbumActivity : AppCompatActivity() {
    private lateinit var binding: ActivityAlbumBinding
    private lateinit var albumAdapter: AlbumAdapter
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAlbumBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.toolbar.apply {
            title = "나만의 앨범"
            setSupportActionBar(this)
        }
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val images = (intent.getStringArrayExtra("images") ?: emptyArray()).map {
            AlbumItem(Uri.parse(it))
        }

        albumAdapter = AlbumAdapter(images)

        binding.viewpager.apply {
            adapter = albumAdapter
        }

        TabLayoutMediator(binding.tabLayout, binding.viewpager) { tab, position ->
            binding.viewpager.currentItem = position
        }.attach()
    }
}