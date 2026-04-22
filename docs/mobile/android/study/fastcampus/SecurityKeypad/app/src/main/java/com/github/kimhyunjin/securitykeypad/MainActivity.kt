package com.github.kimhyunjin.securitykeypad

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.github.kimhyunjin.securitykeypad.databinding.ActivityMainBinding
import com.github.kimhyunjin.securitykeypad.util.AppSignatureHelper

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        binding.view = this

        AppSignatureHelper(this).apply {
            Log.d("hash", "hash : ${appSignature}")
        }
    }

    fun openShuffleKeypad() {
        startActivity(Intent(this, PinActivity::class.java))
    }

    fun openVerifyOTP() {
        startActivity(Intent(this, IdentityInputActivity::class.java))
    }

}