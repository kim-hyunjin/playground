package com.github.kimhyunjin.architecturepattern.mvp.repository

import com.github.kimhyunjin.architecturepattern.ImageResponse
import com.github.kimhyunjin.architecturepattern.RetrofitManager
import retrofit2.Call
import retrofit2.Response

class ImageRepositoryImpl: ImageRepository {
    override fun getRandomImage(callback: ImageRepository.Callback) {
        RetrofitManager.imageService.getRandomImage().enqueue(object: retrofit2.Callback<List<ImageResponse>> {
            override fun onResponse(
                call: Call<List<ImageResponse>>,
                response: Response<List<ImageResponse>>
            ) {
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
}