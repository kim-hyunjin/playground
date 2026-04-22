package com.github.kimhyunjin.mywindowmanager

import android.Manifest
import android.content.ComponentName
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.net.toUri
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.github.kimhyunjin.mywindowmanager.databinding.ActivityMainBinding
import com.github.kimhyunjin.mywindowmanager.service.MyForegroundService


class MainActivity : AppCompatActivity() {
    private val binding: ActivityMainBinding by lazy {
        ActivityMainBinding.inflate(layoutInflater)
    }

    private val overlayPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) {
        if (Settings.canDrawOverlays(this)) {
            runOverlay()
        } else {
            Toast.makeText(this, "오버레이를 띄우려면 설정이 필요합니다.", Toast.LENGTH_LONG).show()
        }
    }


    private val notificationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission(),
    ) { isGranted: Boolean ->
        if (isGranted) {
            runMyForegroundService()
        } else {
            Toast.makeText(this, "알림을 받으려면 설정이 필요합니다.", Toast.LENGTH_LONG).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(binding.root)
        ViewCompat.setOnApplyWindowInsetsListener(binding.main) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        binding.foregroundBtn.setOnClickListener {
            checkNotificationPermission()
        }
        binding.overlayBtn.setOnClickListener {
            checkOverlayPermission()
        }
        binding.destroyBtn.setOnClickListener {
            destroyOverlay()
        }


        val message = intent.getStringExtra("message")
        Log.i("message", "$message")
        if (message.equals("runForeground")) {
            checkNotificationPermission()
            finish()
        }
    }

    private fun checkOverlayPermission() {
        if (Settings.canDrawOverlays(this)) {
            runOverlay()
            return;
        } else {
            showOverlayPermissionRationaleDialog()
        }
    }

    private fun showOverlayPermissionRationaleDialog() {
        AlertDialog.Builder(this).setMessage("오버레이를 띄우려면 권한이 필요해요!")
            .setPositiveButton("권한 설정하기") { _, _ ->
                val intent = Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    "package:$packageName".toUri()
                )
                overlayPermissionLauncher.launch(intent)
            }.setNegativeButton("취소") { dialog, _ -> dialog.cancel() }.show()
    }

    private fun checkNotificationPermission() {
        // This is only necessary for API level >= 33 (TIRAMISU)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) ==
                PackageManager.PERMISSION_GRANTED
            ) {
                runMyForegroundService()
                return
            }

            val needExplain =
                shouldShowRequestPermissionRationale(Manifest.permission.POST_NOTIFICATIONS)
            Log.i("checkNotificationPermission", "$needExplain")
            if (needExplain) {
                showNotificationPermissionRationalDialog()
            } else {
                // Directly ask for the permission
                notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            }
        } else {
            runMyForegroundService()
        }
    }

    @RequiresApi(Build.VERSION_CODES.TIRAMISU)
    private fun showNotificationPermissionRationalDialog() {
        AlertDialog.Builder(this).setMessage("알림을 받으려면 권한이 필요해요!")
            .setPositiveButton("권한 혀용하기") { _, _ ->
                notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            }.setNegativeButton("취소") { dialog, _ -> dialog.cancel() }.show()
    }

    private fun runMyForegroundService() {
        val serviceIntent = Intent(
            this,
            MyForegroundService::class.java
        )
        startForegroundService(serviceIntent)
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