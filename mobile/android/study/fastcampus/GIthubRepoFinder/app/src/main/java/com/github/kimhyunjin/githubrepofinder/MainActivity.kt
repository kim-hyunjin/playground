package com.github.kimhyunjin.githubrepofinder

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.widget.Toast
import androidx.core.widget.addTextChangedListener
import androidx.recyclerview.widget.LinearLayoutManager
import com.github.kimhyunjin.githubrepofinder.adapter.UserAdapter
import com.github.kimhyunjin.githubrepofinder.databinding.ActivityMainBinding
import com.github.kimhyunjin.githubrepofinder.model.UserDto
import com.github.kimhyunjin.githubrepofinder.network.GithubService
import com.github.kimhyunjin.githubrepofinder.network.GithubServiceSingleton
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var userAdapter: UserAdapter
    private lateinit var githubService: GithubService

    private val handler = Handler(Looper.getMainLooper())
    private var searchFor: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        userAdapter = UserAdapter {
            val intent = Intent(this@MainActivity, RepoActivity::class.java)
            intent.putExtra("username", it.username)
            startActivity(intent)
        }
        githubService = GithubServiceSingleton.getInstance(this)


        binding.userRecyclerView.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = userAdapter
        }

        val runnable = Runnable {
            searchUser()
        }

        binding.searchEditText.addTextChangedListener {
            searchFor = it.toString()
            handler.removeCallbacks(runnable)
            handler.postDelayed(runnable, 300)
        }

    }

    private fun searchUser() {
        githubService.searchUsers(searchFor).enqueue(object : Callback<UserDto> {
            override fun onResponse(call: Call<UserDto>, response: Response<UserDto>) {
                Log.i("searchUsers", response.body().toString())
                userAdapter.submitList(response.body()?.items)
            }

            override fun onFailure(call: Call<UserDto>, t: Throwable) {
                Log.e("searchUsers", t.toString())
                Toast.makeText(this@MainActivity, "에러 발생", Toast.LENGTH_SHORT).show()
            }

        })
    }


}