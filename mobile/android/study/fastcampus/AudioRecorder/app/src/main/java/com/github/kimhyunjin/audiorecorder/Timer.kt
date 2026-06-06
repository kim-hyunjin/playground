package com.github.kimhyunjin.audiorecorder

import android.os.Handler
import android.os.Looper

class Timer(private val listener: Timer.OnTimerTickListener, private val delayMillis: Long = 100L) {

    private var duration = 0L
    private val handler = Handler(Looper.getMainLooper())
    private val runnable: Runnable = object: Runnable {
        override fun run() {
            duration += delayMillis
            handler.postDelayed(this, delayMillis)
            listener.onTick(duration)
        }
    }

    fun start() {
        handler.postDelayed(runnable, delayMillis)
    }

    fun stop() {
        handler.removeCallbacks(runnable)
    }

    fun clearDuration() {
        duration = 0L
    }

    interface OnTimerTickListener {
        fun onTick(duration: Long)
    }
}