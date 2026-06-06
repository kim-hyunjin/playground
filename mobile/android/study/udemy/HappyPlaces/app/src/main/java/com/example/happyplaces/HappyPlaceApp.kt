package com.example.happyplaces

import android.app.Application
import com.example.happyplaces.models.PlaceDatabase

class HappyPlaceApp: Application() {
    val db: PlaceDatabase by lazy {
        PlaceDatabase.getInstance(this)
    }
}