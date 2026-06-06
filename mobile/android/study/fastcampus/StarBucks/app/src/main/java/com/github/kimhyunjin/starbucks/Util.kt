package com.github.kimhyunjin.starbucks

import android.content.Context
import com.google.gson.Gson
import java.io.IOException

fun <T> Context.readData(filename: String, classT: Class<T>): T? {
    return try {
        val inputStream = this.resources.assets.open(filename)

        val buffer = ByteArray(inputStream.available())
        inputStream.read(buffer)
        inputStream.close()

        val gson = Gson()
        gson.fromJson(String(buffer), classT)
    } catch (e: IOException) {
        null
    }

}

