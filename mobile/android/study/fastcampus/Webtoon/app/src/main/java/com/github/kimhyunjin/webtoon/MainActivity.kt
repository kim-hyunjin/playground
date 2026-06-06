package com.github.kimhyunjin.webtoon

import android.content.Context
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.github.kimhyunjin.webtoon.databinding.ActivityMainBinding
import com.google.android.material.tabs.TabLayoutMediator

class MainActivity : AppCompatActivity(), WebViewFragment.OnTabNameChangeListener {

    private lateinit var binding: ActivityMainBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.viewPager.adapter = ViewPagerAdapter(this)

        val sharedPreference = getSharedPreferences(SHARED_PREFERENCE_KEY, Context.MODE_PRIVATE)
        TabLayoutMediator(binding.tabLayout, binding.viewPager) { tab, position ->
            run {
                tab.text = sharedPreference.getString(getSharedPreferenceTabNameKey(position), "tab $position")
            }
        }.attach()
    }

    override fun onBackPressed() {
        val currentFragment = supportFragmentManager.fragments[binding.viewPager.currentItem]
        if (currentFragment is WebViewFragment) {
            if (currentFragment.canGoBack()) {
                currentFragment.goBack()
            } else {
                super.onBackPressed()
            }
        } else {
            super.onBackPressed()
        }
    }

    override fun onNameChanged(position: Int, name: String) {
        val tab = binding.tabLayout.getTabAt(position)
        tab?.text = name
    }
}