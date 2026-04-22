package com.example.movieapp;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.databinding.DataBindingUtil;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.annotation.SuppressLint;
import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;

import com.example.movieapp.adapter.MovieAdapter;
import com.example.movieapp.databinding.ActivityMainBinding;
import com.example.movieapp.model.Movie;
import com.example.movieapp.viewmodel.MainActivityViewModel;

import java.util.Objects;

import io.reactivex.rxjava3.disposables.Disposable;

public class MainActivity extends AppCompatActivity {

    private RecyclerView recyclerView;
    private MovieAdapter movieAdapter;
    private SwipeRefreshLayout swipeRefreshLayout;
    private MainActivityViewModel mainActivityViewModel;
    private ActivityMainBinding activityMainBinding;

    private Disposable disposable;


    @SuppressLint("CheckResult")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        activityMainBinding = DataBindingUtil.setContentView(this, R.layout.activity_main);
        mainActivityViewModel = new ViewModelProvider(this).get(MainActivityViewModel.class);
        setSupportActionBar(activityMainBinding.myToolbar);
        Objects.requireNonNull(getSupportActionBar()).setTitle("Movie App");

        initRecyclerviewAndAdapter();
        initSwipeRefreshLayout();
        initSearchView();

        // subscribe to paging data
        subscribeMoviePagingData();
    }

    private void initRecyclerviewAndAdapter() {

        recyclerView = activityMainBinding.rvMovies;
        movieAdapter = new MovieAdapter(new DiffUtil.ItemCallback<Movie>() {
            @Override
            public boolean areItemsTheSame(@NonNull Movie oldItem, @NonNull Movie newItem) {
                return Objects.equals(oldItem.getId(), newItem.getId());
            }

            @Override
            public boolean areContentsTheSame(@NonNull Movie oldItem, @NonNull Movie newItem) {
                return Objects.equals(oldItem.getId(), newItem.getId());
            }
        }, this);

        if (this.getResources().getConfiguration().orientation == Configuration.ORIENTATION_PORTRAIT){
            recyclerView.setLayoutManager(new GridLayoutManager(this, 2));
        }else{
            recyclerView.setLayoutManager(new GridLayoutManager(this, 4));
        }

        recyclerView.setItemAnimator(new DefaultItemAnimator());
        recyclerView.setAdapter(movieAdapter);
    }

    private void initSwipeRefreshLayout() {
        swipeRefreshLayout = activityMainBinding.swipeLayout;
        swipeRefreshLayout.setColorSchemeResources(R.color.teal_200);
        swipeRefreshLayout.setOnRefreshListener(() -> {
            if (disposable != null) disposable.dispose();
            disposable = mainActivityViewModel.moviePagingDataFlowable.retry().subscribe(moviePagingData -> {
                movieAdapter.submitData(getLifecycle(), moviePagingData);
                swipeRefreshLayout.setRefreshing(false);
            });
        });
    }

    private void initSearchView() {
        activityMainBinding.searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                if (disposable != null) disposable.dispose();
                if (query.trim().isEmpty()) {
                    mainActivityViewModel.getPopulars();
                } else {
                    mainActivityViewModel.searchMovies(query);
                }
                subscribeMoviePagingData();
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                return false;
            }
        });

        activityMainBinding.searchView.setOnCloseListener(() -> {
            Log.i("SearchView", "onClose");
            if (disposable != null) disposable.dispose();
            mainActivityViewModel.getPopulars();
            subscribeMoviePagingData();
            return false;
        });
    }

    private void subscribeMoviePagingData() {
        disposable = mainActivityViewModel.moviePagingDataFlowable.subscribe(moviePagingData -> movieAdapter.submitData(getLifecycle(), moviePagingData));
    }
}