package com.github.kimhyunjin.githubrepofinder

import android.content.Intent
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.github.kimhyunjin.githubrepofinder.adapter.RepoAdapter
import com.github.kimhyunjin.githubrepofinder.databinding.ActivityRepoBinding
import com.github.kimhyunjin.githubrepofinder.model.Repo
import com.github.kimhyunjin.githubrepofinder.network.GithubService
import com.github.kimhyunjin.githubrepofinder.network.GithubServiceSingleton
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RepoActivity : AppCompatActivity() {
    private lateinit var binding: ActivityRepoBinding
    private lateinit var repoAdapter: RepoAdapter
    private lateinit var githubService: GithubService
    private var page = 0
    private var hasMore = true
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRepoBinding.inflate(layoutInflater)
        setContentView(binding.root)

        repoAdapter = RepoAdapter {
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(it.htmlUrl))
            startActivity(intent)
        }
        githubService = GithubServiceSingleton.getInstance(this)

        val linearLayoutManager = LinearLayoutManager(this@RepoActivity)
        binding.repoRecyclerView.apply {
            layoutManager = linearLayoutManager
            adapter = repoAdapter
        }

        val username = intent.getStringExtra("username") ?: return
        binding.usernameTextView.text = username
        searchRepo(username, 0)

        binding.repoRecyclerView.addOnScrollListener(object: RecyclerView.OnScrollListener() {
            override fun onScrolled(recyclerView: RecyclerView, dx: Int, dy: Int) {
                super.onScrolled(recyclerView, dx, dy)

                val totalCount = linearLayoutManager.itemCount
                val lastVisiblePosition = linearLayoutManager.findLastCompletelyVisibleItemPosition()

                if (lastVisiblePosition >= totalCount - 1 && hasMore) {
                    page += 1
                    searchRepo(username, page)
                }

            }
        })
    }

    private fun searchRepo(username: String, page: Int) {
        githubService.listRepos(username, page).enqueue(object : Callback<List<Repo>> {
            override fun onResponse(call: Call<List<Repo>>, response: Response<List<Repo>>) {
                Log.i("listRepos", response.body().toString())
                hasMore = response.body()?.count() == 30
                repoAdapter.submitList(repoAdapter.currentList + response.body().orEmpty())
            }

            override fun onFailure(call: Call<List<Repo>>, t: Throwable) {
                Log.e("listRepos", t.toString())
            }

        })
    }
}