package com.github.kimhyunjin.chattingapp

import android.app.NotificationChannel
import android.app.NotificationManager
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class MyFirebaseMessagingService : FirebaseMessagingService() {
    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)

        val name = "채팅 알림"
        val description = "새로운 채팅이 있습니다."
        val importance = NotificationManager.IMPORTANCE_DEFAULT
        val mChannel = NotificationChannel(
            getString(R.string.default_notification_channel_id),
            name,
            importance
        )
        mChannel.description = description

        val notificationManager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.createNotificationChannel(mChannel)

        val title = message.notification?.title
        val body = message.notification?.body
        val builder = NotificationCompat.Builder(
            applicationContext,
            getString(R.string.default_notification_channel_id)
        ).setSmallIcon(R.drawable.ic_baseline_chat_24).setContentTitle(title)
            .setContentText(body)

        notificationManager.notify(0, builder.build())
    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)
    }
}