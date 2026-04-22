package com.github.kimhyunjin.githubrepofinder.network

import com.github.kimhyunjin.githubrepofinder.model.Repo
import com.github.kimhyunjin.githubrepofinder.model.UserDto
import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

interface GithubService {

    @GET("users/{username}/repos")
    fun listRepos(@Path("username") username: String, @Query("page") page: Int): Call<List<Repo>>

    @GET("search/users")
    fun searchUsers(@Query("q") query: String): Call<UserDto>
}