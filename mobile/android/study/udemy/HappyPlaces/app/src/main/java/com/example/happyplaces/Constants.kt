package com.example.happyplaces

import android.Manifest
import android.os.Build

val READ_IMAGE_PERMISSION = if (Build.VERSION.SDK_INT >= 33) Manifest.permission.READ_MEDIA_IMAGES else Manifest.permission.READ_EXTERNAL_STORAGE
val IMAGE_DIRECTORY = "HappyPlaceImages"