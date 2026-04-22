package com.example.movieapp.service;

import com.example.movieapp.model.Result;

import io.reactivex.rxjava3.core.Single;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Query;

public interface MovieDataService {

    @GET("movie/popular")
    Single<Result> getPopularMovies(@Header("Authorization") String authorization, @Query("page") int page);

    @GET("search/movie")
    Single<Result> getMoviesWithKeyword(@Header("Authorization") String authorization, @Query("query") String query, @Query("page") int page);
}
