package com.example.movieapp.model;

import android.app.Application;


import com.example.movieapp.R;
import com.example.movieapp.service.MovieDataService;
import com.example.movieapp.service.RetrofitInstance;

import java.util.List;

import io.reactivex.rxjava3.core.Single;
import io.reactivex.rxjava3.schedulers.Schedulers;

public class MovieRepository {
    private final Application application;

    public MovieRepository(Application application) {
        this.application = application;
    }

    public Single<List<Movie>> getMovies(Integer page) {
        MovieDataService movieDataService = RetrofitInstance.getService();
        Single<Result> result = movieDataService.getPopularMovies(application.getApplicationContext().getString(R.string.api_key), page);
        return result.subscribeOn(Schedulers.io())
                .map(Result::getResults);
    }

    public Single<List<Movie>> searchMovies(String query, Integer page) {
        MovieDataService movieDataService = RetrofitInstance.getService();
        Single<Result> result = movieDataService.getMoviesWithKeyword(application.getApplicationContext().getString(R.string.api_key), query, page);
        return result.subscribeOn(Schedulers.io())
                .map(Result::getResults);
    }
}
