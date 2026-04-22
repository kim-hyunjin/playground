package com.github.kimhyunjin.architecturepattern

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.github.kimhyunjin.architecturepattern.databinding.ActivityMainBinding
import com.github.kimhyunjin.architecturepattern.mvc.MvcActivity
import com.github.kimhyunjin.architecturepattern.mvi.MviActivity
import com.github.kimhyunjin.architecturepattern.mvp.MvpActivity
import com.github.kimhyunjin.architecturepattern.mvvm.MvvmActivity

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater).also {
            setContentView(it.root)
            it.view = this
        }
    }

    fun openMvc() {
        startActivity(Intent(this, MvcActivity::class.java))
    }

    fun openMvp() {
        startActivity(Intent(this, MvpActivity::class.java))
    }

    fun openMvvm() {
        startActivity(Intent(this, MvvmActivity::class.java))
    }

    fun openMvi() {
        startActivity(Intent(this, MviActivity::class.java))
    }
}