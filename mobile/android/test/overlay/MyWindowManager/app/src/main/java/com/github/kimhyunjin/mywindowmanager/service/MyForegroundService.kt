package com.github.kimhyunjin.mywindowmanager.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.util.Log
import com.github.kimhyunjin.mywindowmanager.MainActivity
import com.github.kimhyunjin.mywindowmanager.R


class MyForegroundService : Service() {

    override fun onCreate() {
        super.onCreate()
        Log.i("MyForegroundService", "STARTED!")
        val notification = createNotification()
        startForeground(NOTIFICATION_ID, notification)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {

        return super.onStartCommand(intent, flags, startId)
    }

    private fun createNotification(): Notification {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "My Foreground Service",
            NotificationManager.IMPORTANCE_HIGH
        )
        val manager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
        manager.createNotificationChannel(channel)

        val mainPendingIntent = PendingIntent.getActivity(
            this,
            0,
            Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_SINGLE_TOP
            },
            PendingIntent.FLAG_IMMUTABLE
        )

        val builder =
            Notification.Builder(this, CHANNEL_ID).apply {
                setContentTitle("My Foreground Service")
                setContentText("Running...")
                setSmallIcon(
                    R.drawable.ic_launcher_foreground
                )
                setContentIntent(mainPendingIntent)
                setVisibility(Notification.VISIBILITY_PUBLIC)
            }

        return builder.build()
    }

    override fun onBind(p0: Intent?): IBinder? {
        return null
    }

    companion object {
        const val NOTIFICATION_ID = 1
        const val CHANNEL_ID = "my_foreground_service"
    }
}