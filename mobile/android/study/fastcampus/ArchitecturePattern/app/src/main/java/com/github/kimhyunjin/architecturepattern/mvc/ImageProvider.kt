package com.github.kimhyunjin.architecturepattern.mvc

import com.github.kimhyunjin.architecturepattern.ImageResponse
import com.github.kimhyunjin.architecturepattern.RetrofitManager
import retrofit2.Call
import retrofit2.Response

class ImageProvider(private val callback: Callback) {

    fun getRandomImage() {
        RetrofitManager.imageService.getRandomImage().enqueue(object : retrofit2.Callback<List<ImageResponse>> {
            override fun onResponse(call: Call<List<ImageResponse>>, response: Response<List<ImageResponse>>) {
                if (response.isSuccessful) {
                    response.body()?.let {
                        callback.onLoadImage(it.random().url)
                    }
                }
            }

            override fun onFailure(call: Call<List<ImageResponse>>, t: Throwable) {
                TODO("Not yet implemented")
            }

        })
    }

    interface Callback {
        fun onLoadImage(url: String)
    }
}