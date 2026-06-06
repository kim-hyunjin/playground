package com.github.kimhyunjin.webtoon

import androidx.fragment.app.Fragment
import androidx.viewpager2.adapter.FragmentStateAdapter

class ViewPagerAdapter(private val mainActivity: MainActivity) :
    FragmentStateAdapter(mainActivity) {
    override fun getItemCount(): Int {
        return 3
    }

    override fun createFragment(position: Int): Fragment {
        val urls = listOf<String>(
            "https://comic.naver.com/webtoon/detail?titleId=814543&no=9&week=tue",
            "https://comic.naver.com/webtoon/detail?titleId=478261&no=82&week=thu",
            "https://comic.naver.com/webtoon/detail?titleId=769209&no=91&week=wed"
        )
        return WebViewFragment.newInstance(urls[position], position, mainActivity)
    }
}