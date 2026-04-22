package com.github.kimhyunjin.weatherapp

data class Forecast(
    val date: String,
    val time: String,
    var temperature: Double = 0.0,
    var sky: SkyType? = null,
    var precipitation: Int = 0,
    var precipitationType: PrecipitationType = PrecipitationType.NONE,
) {
    val weather: String
        get() {
            return if (precipitationType == PrecipitationType.NONE) {
                sky?.getString() ?: ""
            } else {
                precipitationType.getString()
            }
        }
}

enum class PrecipitationType(val code: Int) {
    NONE(0),
    RAIN(1),
    RAIN_OR_SNOW(2),
    SNOW(3),
    HEAVY_RAIN(4);

    companion object {
        fun fromCode(code: Int): PrecipitationType {
            return PrecipitationType.values().first { it.code == code }
        }
    }

    fun getString(): String {
        return when (this.code) {
            0 -> ""
            1 -> "비"
            2 -> "비 또는 눈"
            3 -> "눈"
            4 -> "소나기"
            else -> ""
        }
    }
}

enum class SkyType(val code: Int) {
    SUNNY(1),
    CLOUDY(3),
    RAIN(4);

    companion object {
        fun fromCode(code: Int): SkyType {
            return SkyType.values().first { it.code == code }
        }
    }

    fun getString(): String {
        return when (this.code) {
            1 -> "맑음"
            3 -> "구름많음"
            4 -> "비"
            else -> ""
        }
    }
}