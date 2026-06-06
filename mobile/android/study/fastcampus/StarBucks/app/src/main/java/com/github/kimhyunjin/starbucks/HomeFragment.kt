package com.github.kimhyunjin.starbucks

import android.animation.ValueAnimator
import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import com.bumptech.glide.Glide
import com.github.kimhyunjin.starbucks.databinding.FragmentHomeBinding

class HomeFragment : Fragment(R.layout.fragment_home) {

    private lateinit var binding: FragmentHomeBinding
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentHomeBinding.bind(view)

        val homeData = context?.readData("home.json", Home::class.java) ?: return
        val menuData = context?.readData("menu.json", Menu::class.java) ?: return

        initAppBar(homeData)
        initRecommendMenuList(homeData, menuData)
        initBanner(homeData)
        initFoodList(menuData)
        setupFloatingActionButton()
    }

    private fun setupFloatingActionButton() {
        binding.scrollView.setOnScrollChangeListener { v, scrollX, scrollY, oldScrollX, oldScrollY ->
            if (scrollY == 0) {
                binding.fab.extend()
            } else {
                binding.fab.shrink()
            }
        }
    }

    private fun initFoodList(menuData: Menu) {
        binding.foodMenuList.tvTitle.text = getString(R.string.food_menu_title)
        menuData.food.forEach { menuItem ->
            binding.foodMenuList.menuLayout.addView(MenuView(context = requireContext()).apply {
                setTitle(menuItem.name)
                setImageUrl(menuItem.image)
            })
        }
    }

    private fun initBanner(homeData: Home) {
        Glide.with(binding.bannerLayout.ivBanner).load(homeData.banner.image)
            .into(binding.bannerLayout.ivBanner)
        binding.bannerLayout.ivBanner.contentDescription = homeData.banner.contentDescription
    }

    private fun initRecommendMenuList(
        homeData: Home,
        menuData: Menu
    ) {
        binding.recommendMenuList.tvTitle.text =
            getString(R.string.recommend_title, homeData.user.nickname)

        menuData.coffee.forEach { menuItem ->
            binding.recommendMenuList.menuLayout.addView(MenuView(context = requireContext()).apply {
                setTitle(menuItem.name)
                setImageUrl(menuItem.image)
            })
        }
    }

    private fun initAppBar(homeData: Home) {
        binding.appBarTitleTextView.text =
            getString(R.string.appbar_title_text, homeData.user.nickname)
        binding.startCountTextView.text =
            getString(R.string.appbar_star_title, homeData.user.starCount, homeData.user.totalCount)
        Glide.with(binding.appBarImageView).load(homeData.appbarImage).into(binding.appBarImageView)

        binding.appBarProgressBar.max = homeData.user.totalCount
        ValueAnimator.ofInt(0, homeData.user.starCount).apply {
            duration = 1000
            addUpdateListener {
                binding.appBarProgressBar.progress = it.animatedValue as Int
            }
            start()
        }
    }
}