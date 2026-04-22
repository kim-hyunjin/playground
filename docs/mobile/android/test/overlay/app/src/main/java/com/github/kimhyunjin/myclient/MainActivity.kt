package com.github.kimhyunjin.myclient

import android.content.ComponentName
import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.github.kimhyunjin.myclient.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    private val binding: ActivityMainBinding by lazy {
        ActivityMainBinding.inflate(layoutInflater)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(binding.root)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        binding.startForegroundApp.setOnClickListener {
            val intent = Intent()
            intent.setComponent(
                ComponentName(
                    "com.github.kimhyunjin.mywindowmanager",
                    "com.github.kimhyunjin.mywindowmanager.MainActivity"
                )
            )
            intent.putExtra("message", "runForeground")
            startActivity(intent)
        }

        binding.runOverlayButton.setOnClickListener {
            runOverlay()
        }

        binding.destroyOverlayButton.setOnClickListener {
            destroyOverlay()
        }
    }

    private fun runOverlay() {
        Log.i("TEST", "runOverlay")
        Intent().also { intent ->
            intent.setComponent(
                ComponentName(
                    "com.github.kimhyunjin.mywindowmanager",
                    "com.github.kimhyunjin.mywindowmanager.receiver.MyBroadcastReceiver"
                )
            )
            intent.setAction("com.test.MY_BROADCAST")
            intent.putExtra("data", "runOverlay")
            sendBroadcast(intent)
        }
    }

    private fun destroyOverlay() {
        Log.i("TEST", "destroyOverlay")
        Intent().also { intent ->
            intent.setComponent(
                ComponentName(
                    "com.github.kimhyunjin.mywindowmanager",
                    "com.github.kimhyunjin.mywindowmanager.receiver.MyBroadcastReceiver"
                )
            )
            intent.setAction("com.test.MY_BROADCAST")
            intent.putExtra("data", "destroyOverlay")
            sendBroadcast(intent)
        }
    }
}