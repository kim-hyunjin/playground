package com.github.kimhyunjin.tomorrowhouse.data

data class ArticleItem(
    val articleId: String? = null,
    val description: String? = null,
    val imageUrl: String? = null,
    var isBookmark: Boolean = false
)
