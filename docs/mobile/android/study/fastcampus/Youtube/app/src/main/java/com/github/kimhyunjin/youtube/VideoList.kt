package com.github.kimhyunjin.youtube

import com.github.kimhyunjin.youtube.player.PlayerVideo
import com.google.gson.annotations.SerializedName

data class VideoList(
    val videos: List<VideoItem>
)

data class VideoItem(
    val id: String,
    val title: String,
    @SerializedName("sources")
    val videoUrl: String,
    val channelName: String,
    val viewCount: String,
    val dateText: String,
    val channelThumb: String,
    @SerializedName("thumb")
    val videoThumb: String,
)

fun VideoItem.transform(): PlayerVideo {
    return PlayerVideo(
        id = id,
        title = title,
        videoUrl = videoUrl,
        channelName = channelName,
        viewCount = viewCount,
        dateText = dateText,
        channelThumb = channelThumb,
        videoThumb = videoThumb
    )
}