package com.github.kimhyunjin.foodmap

import android.app.Application
import android.content.Context

class FoodMapApplication: Application() {

    override fun onCreate() {
        super.onCreate()
        applicationCtx = applicationContext
    }

    companion object {
        lateinit var applicationCtx: Context
    }
}