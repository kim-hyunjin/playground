package com.github.kimhyunjin.architecturepattern

import com.google.gson.annotations.SerializedName

data class ImageResponse(
    @SerializedName("id")
    val id: String,
    @SerializedName("download_url")
    val url: String
)