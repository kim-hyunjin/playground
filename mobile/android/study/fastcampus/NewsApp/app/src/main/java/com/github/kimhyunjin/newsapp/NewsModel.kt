package com.github.kimhyunjin.newsapp

data class NewsModel(
    val title: String,
    val link: String,
    var imageUrl: String? = null
)

fun List<NewsItem>.transform() : List<NewsModel> {
    return this.map {
        NewsModel(
            it.title ?: "",
            it.link ?: "",
            null
        )
    }
}