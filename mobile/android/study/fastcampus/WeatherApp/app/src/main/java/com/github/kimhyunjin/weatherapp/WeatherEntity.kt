package com.github.kimhyunjin.weatherapp

import com.google.gson.annotations.SerializedName

data class WeatherResponse(
    @SerializedName("response")
    val response: WeatherResponseRoot
)

data class WeatherResponseRoot(
    @SerializedName("header")
    val header: WeatherResponseHeader,
    @SerializedName("body")
    val body: WeatherResponseBody
)

data class WeatherResponseHeader(
    @SerializedName("resultCode")
    val resultCode: String,
    @SerializedName("resultMsg")
    val resultMessage: String,
)

data class WeatherResponseBody(
    @SerializedName("items")
    val items: WeatherEntityList
)

data class WeatherEntityList(
    @SerializedName("item")
    val entities: List<WeatherEntity>
)

data class WeatherEntity(
    @SerializedName("baseDate")
    val baseDate: String,
    @SerializedName("baseTime")
    val baseTime: String,
    @SerializedName("category")
    val category: Category?,
    @SerializedName("fcstDate")
    val forecastDate: String,
    @SerializedName("fcstTime")
    val forecastTime: String,
    @SerializedName("fcstValue")
    val forecastValue: String,
    @SerializedName("nx")
    val nx: Int,
    @SerializedName("ny")
    val ny: Int,
)