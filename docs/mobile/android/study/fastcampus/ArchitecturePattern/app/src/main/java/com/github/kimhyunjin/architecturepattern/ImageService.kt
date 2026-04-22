package com.github.kimhyunjin.architecturepattern

import io.reactivex.Single
import retrofit2.Call
import retrofit2.http.GET

interface ImageService {

    @GET("v2/list")
    fun getRandomImage(): Call<List<ImageResponse>>

    @GET("v2/list")
    fun getRandomImageRx(): Single<List<ImageResponse>>

    /**
     * suspend 함수인 경우 retrofit이 내부적으로 enqueue진행 -> 내부적으로 비동기 처리
     * 참고 - https://seokzoo.tistory.com/4
     *
     */
    @GET("v2/list")
    suspend fun getRandomImageSuspend(): List<ImageResponse>
}