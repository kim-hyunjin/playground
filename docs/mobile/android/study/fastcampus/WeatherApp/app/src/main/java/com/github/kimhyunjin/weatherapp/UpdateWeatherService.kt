package com.github.kimhyunjin.weatherapp

import android.Manifest
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import android.os.IBinder
import android.util.Log
import android.widget.RemoteViews
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat

class UpdateWeatherService : Service() {

    private lateinit var appWidgetManager: AppWidgetManager
    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        appWidgetManager = AppWidgetManager.getInstance(this)

        // foreground 로 전환
        createChannel()
        startForeground(1, createNotification())

        if (ActivityCompat.checkSelfPermission(
                this, Manifest.permission.ACCESS_BACKGROUND_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            handleNotHavePermission()
            return super.onStartCommand(intent, flags, startId)
        }

//        LocationServices.getFusedLocationProviderClient(this).lastLocation.addOnSuccessListener { location ->
//            WeatherRepository.fetchForecast(location, onSuccess = { forecasts ->
//                updateWidgetUI(forecasts)
//            }, onFail = {
//                handleUpdateFail()
//            })
//        }

        Log.e("Widget", "============================")
        val targetLocation = Location("")
        targetLocation.latitude = 37.5635694444444
        targetLocation.longitude = 126.980008333333
        WeatherRepository.fetchForecast(targetLocation, onSuccess = { forecasts ->
            updateWidgetUI(forecasts)
        }, onFail = {
            handleUpdateFail()
        })
        return super.onStartCommand(intent, flags, startId)
    }

    private fun createChannel() {
        val channel = NotificationChannel(
            getString(R.string.widget_refresh_channel),
            "날씨앱",
            NotificationManager.IMPORTANCE_LOW
        )
        channel.description = "위젯 업데이트 채널"
        val manager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
        manager.createNotificationChannel(channel)
    }

    private fun createNotification(): Notification {
        return NotificationCompat.Builder(this, getString(R.string.widget_refresh_channel))
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentTitle("날씨앱")
            .setContentText("날씨 업데이트")
            .build()
    }

    private fun handleNotHavePermission() {
        val pendingIntent: PendingIntent = Intent(this, SettingActivity::class.java).let {
            PendingIntent.getActivity(this, 2, it, PendingIntent.FLAG_IMMUTABLE)
        }

        RemoteViews(packageName, R.layout.widget_weather).apply {
            setTextViewText(R.id.widgetTemperatureTextView, "권한없음")
            setTextViewText(R.id.widgetSkyTextView, "")
            setOnClickPendingIntent(R.id.widgetTemperatureTextView, pendingIntent)
        }.also { remoteViews ->
            updateAppWidget(remoteViews)
        }

        stopSelf()
    }

    private fun updateAppWidget(remoteViews: RemoteViews) {
        val appWidgetName =
            ComponentName(this, WeatherAppWidgetProvider::class.java)
        appWidgetManager.updateAppWidget(appWidgetName, remoteViews)
    }


    private fun updateWidgetUI(forecasts: List<Forecast>) {

        val currentForecast = forecasts.first()
        RemoteViews(packageName, R.layout.widget_weather).apply {
            setTextViewText(
                R.id.widgetTemperatureTextView,
                getString(R.string.temperature_text, currentForecast.temperature)
            )
            setTextViewText(R.id.widgetSkyTextView, currentForecast.weather)
            setOnClickPendingIntent(
                R.id.widgetTemperatureTextView,
                getWeatherServicePendingIntent()
            )
        }.also { remoteViews ->
            updateAppWidget(remoteViews)
        }
    }

    private fun getWeatherServicePendingIntent(): PendingIntent {
        val updateWeatherServiceIntent = Intent(this, UpdateWeatherService::class.java)

        return PendingIntent.getService(
            this,
            1,
            updateWeatherServiceIntent,
            PendingIntent.FLAG_IMMUTABLE
        )
    }

    private fun handleUpdateFail() {
        RemoteViews(packageName, R.layout.widget_weather).apply {
            setTextViewText(
                R.id.widgetTemperatureTextView,
                "에러"
            )
            setTextViewText(
                R.id.widgetSkyTextView,
                ""
            )
            setOnClickPendingIntent(
                R.id.widgetTemperatureTextView,
                getWeatherServicePendingIntent()
            )
        }.also { remoteViews ->
            updateAppWidget(remoteViews)
        }

        stopSelf()
    }


    override fun onDestroy() {
        stopForeground(STOP_FOREGROUND_REMOVE)
        super.onDestroy()
    }
}