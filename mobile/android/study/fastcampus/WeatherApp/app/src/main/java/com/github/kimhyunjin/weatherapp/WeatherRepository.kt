package com.github.kimhyunjin.weatherapp

import android.location.Location
import android.util.Log
import com.google.gson.GsonBuilder
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.lang.NullPointerException

object WeatherRepository {

    private val gson = GsonBuilder().setLenient().create()

    private val retrofit =
        Retrofit.Builder().baseUrl("https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/")
            .addConverterFactory(
                GsonConverterFactory.create(gson)
            ).build()

    private val service = retrofit.create(WeatherService::class.java)

    fun fetchForecast(
        location: Location,
        onSuccess: (forecasts: List<Forecast>) -> Unit,
        onFail: ((t: Throwable) -> Unit)? = null
    ) {
        val baseDateTime = BaseDateTime.getCurrentBaseDateTime()
        val converter = GeoPointConverter()
        val point = converter.convert(lat = location.latitude, lon = location.longitude)
        service.getForecast(
            baseDate = baseDateTime.baseDate,
            baseTime = baseDateTime.baseTime,
            nx = point.nx,
            ny = point.ny
        ).enqueue(object : Callback<WeatherResponse> {
            override fun onResponse(
                call: Call<WeatherResponse>,
                response: Response<WeatherResponse>
            ) {
                val forecasts = deserializeForecastResponse(response)
                if (forecasts.isEmpty()) {
                    onFail?.invoke(NullPointerException())
                } else {
                    onSuccess(forecasts)
                }
            }

            override fun onFailure(call: Call<WeatherResponse>, t: Throwable) {
                t.printStackTrace()
                onFail?.invoke(t)
            }

        })
    }

    private fun deserializeForecastResponse(response: Response<WeatherResponse>): List<Forecast> {
        val weatherList = response.body()?.response?.body?.items?.entities

        val weatherDateTimeMap = mutableMapOf<String, Forecast>()
        weatherList?.forEach {
            Log.i("Weather", it.toString())
            val key = "${it.forecastDate}/${it.forecastTime}"
            weatherDateTimeMap.putIfAbsent(
                key,
                Forecast(date = it.forecastDate, time = it.forecastTime)
            )

            weatherDateTimeMap[key].apply {
                if (this != null && it.category != null) {
                    when (it.category) {
                        Category.POP -> {
                            precipitation = it.forecastValue.toInt()
                        }

                        Category.PTY -> {
                            precipitationType =
                                PrecipitationType.fromCode(it.forecastValue.toInt())
                        }

                        Category.SKY -> {
                            sky = SkyType.fromCode(it.forecastValue.toInt())
                        }

                        Category.TMP -> {
                            temperature = it.forecastValue.toDouble()
                        }
                    }
                }
            }
        }

        Log.i("Forecast", weatherDateTimeMap.toString())
        val list = weatherDateTimeMap.values.toMutableList()
        list.sortWith { f1, f2 ->
            val f1DateTime = "${f1.date}${f1.time}"
            val f2DateTime = "${f2.date}${f1.time}"

            return@sortWith f1DateTime.compareTo(f2DateTime)
        }

        return list
    }
}