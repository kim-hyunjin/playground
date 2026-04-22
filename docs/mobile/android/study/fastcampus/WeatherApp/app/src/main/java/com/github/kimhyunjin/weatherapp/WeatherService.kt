package com.github.kimhyunjin.weatherapp

import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Query

interface WeatherService {
    @GET("getVilageFcst?serviceKey=$WEATHER_API_KEY&pageNo=1&numOfRows=1000&dataType=JSON")
    fun getForecast(
        @Query("base_date") baseDate: String,
        @Query("base_time") baseTime: String,
        @Query("nx") nx: Int,
        @Query("ny") ny: Int,

    ): Call<WeatherResponse>
}