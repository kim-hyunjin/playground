package com.github.kimhyunjin.mywindowmanager.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.github.kimhyunjin.mywindowmanager.service.OverlayService

class MyBroadcastReceiver: BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        val data = intent?.getStringExtra("data")
        Log.i("TEST", "onReceive!! - ${data}")
        data?.let {
            if (it == "runOverlay") {
                context?.startService(Intent(context, OverlayService::class.java))
            } else {
                context?.stopService(Intent(context, OverlayService::class.java))
            }
        }
    }
}