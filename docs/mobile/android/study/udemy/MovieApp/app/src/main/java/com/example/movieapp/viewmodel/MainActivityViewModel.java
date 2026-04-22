package com.example.movieapp.viewmodel;

import android.app.Application;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.ViewModelKt;
import androidx.paging.Pager;
import androidx.paging.PagingConfig;
import androidx.paging.PagingData;
import androidx.paging.PagingState;
import androidx.paging.rxjava3.PagingRx;
import androidx.paging.rxjava3.RxPagingSource;

import com.example.movieapp.model.Movie;
import com.example.movieapp.model.MovieRepository;

import java.util.List;

import io.reactivex.rxjava3.core.Flowable;
import io.reactivex.rxjava3.core.Single;
import kotlinx.coroutines.CoroutineScope;

public class MainActivityViewModel extends AndroidViewModel {
    private final MovieRepository movieRepository;
    public Flowable<PagingData<Movie>> moviePagingDataFlowable;

    private String searchKeyword;

    public MainActivityViewModel(@NonNull Application application) {
        super(application);
        movieRepository = new MovieRepository(application);
        getPopulars();
    }

    public void getPopulars() {
        initPagingSource(SourceType.POPULAR);
        Log.i("getPopulars", "getPopulars called");
    }

    public void searchMovies(String searchKeyword) {
        this.searchKeyword = searchKeyword;
        initPagingSource(SourceType.SEARCH);
        Log.i("searchMovies", searchKeyword);
    }

    private void initPagingSource(SourceType type) {
        MoviePagingSource moviePagingSource = new MoviePagingSource(type);

        Pager<Integer, Movie> pager = new Pager<>(
                new PagingConfig(20, 20, false, 20, 20*499),
                () -> moviePagingSource
        );

        moviePagingDataFlowable = PagingRx.getFlowable(pager);
        CoroutineScope coroutineScope = ViewModelKt.getViewModelScope(this);
        PagingRx.cachedIn(moviePagingDataFlowable, coroutineScope);
    }

    private enum SourceType {
        POPULAR,
        SEARCH
    }

    private class MoviePagingSource extends RxPagingSource<Integer, Movie> {

        SourceType type;

        public MoviePagingSource(SourceType type) {
            this.type = type;
        }

        @Nullable
        @Override
        public Integer getRefreshKey(@NonNull PagingState<Integer, Movie> pagingState) {
            return null;
        }

        @NonNull
        @Override
        public Single<LoadResult<Integer, Movie>> loadSingle(@NonNull LoadParams<Integer> loadParams) {
            try {

                int page = loadParams.getKey() != null ? loadParams.getKey() : 1;
                Single<List<Movie>> moviesSource;
                if (type == SourceType.POPULAR) {
                    moviesSource = movieRepository.getMovies(page);
                } else {
                    moviesSource = movieRepository.searchMovies(searchKeyword, page);
                }
                return moviesSource
                        .map(movies -> toLoadResult(movies, page))
                        .onErrorReturn(LoadResult.Error::new);
            } catch (Exception e) {
                return Single.just(new LoadResult.Error<>(e));
            }
        }

        private LoadResult<Integer, Movie> toLoadResult(List<Movie> movies, int page) {
            return new LoadResult.Page<>(movies, page == 1 ? null : page - 1, page + 1);
        }
    }
}
