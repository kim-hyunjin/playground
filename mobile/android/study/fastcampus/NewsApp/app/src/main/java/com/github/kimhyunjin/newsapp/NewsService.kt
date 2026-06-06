package com.github.kimhyunjin.newsapp

import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

enum class NewsCategory(val key: String) {
    POLITICS("politics"),
    ECONOMY("economy"),
    SOCIETY("society"),
    CULTURE("culture"),
    SPORTS("sports");
}
interface NewsService {

    @GET("browse/feed/")
    fun mainFeed(): Call<NewsRss>

    @GET("category/news/{category}/feed/")
    fun categoryFeed(@Path("category") category: String): Call<NewsRss>

    @GET("browse/feed/") // search 할 수 있는 rss 못찾음
    fun search(@Query("q") query: String): Call<NewsRss>
}