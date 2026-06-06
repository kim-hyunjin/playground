package com.github.kimhyunjin.youtube.player

data class PlayerVideo(
    override val id: String,
    val title: String,
    val videoUrl: String,
    val channelName: String,
    val viewCount: String,
    val dateText: String,
    val channelThumb: String,
    val videoThumb: String,
): PlayerVideoModel
