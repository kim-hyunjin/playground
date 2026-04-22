package com.github.kimhyunjin.stopwatch

import android.media.AudioManager
import android.media.ToneGenerator
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.Gravity
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import androidx.core.view.isVisible
import androidx.core.view.setPadding
import com.github.kimhyunjin.stopwatch.databinding.ActivityMainBinding
import com.github.kimhyunjin.stopwatch.databinding.DialogCountdownSettingBinding
import java.util.Timer
import kotlin.concurrent.timer
import kotlin.math.ceil

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private var countdownSecond = 0
    private var currentCountdownDeciSecond = 0
    private var currentDeciSecond = 0
    private var timer: Timer? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.countdownTextView.setOnClickListener {
            showCountdownSettingDialog()
        }

        binding.lapButton.setOnClickListener {
            lap()
        }
        binding.pauseButton.setOnClickListener {
            pause()
            binding.startButton.isVisible = true
            binding.stopButton.isVisible = true
            binding.pauseButton.isVisible = false
            binding.lapButton.isVisible = false
        }
        binding.startButton.setOnClickListener {
            start()
            binding.startButton.isVisible = false
            binding.stopButton.isVisible = false
            binding.pauseButton.isVisible = true
            binding.lapButton.isVisible = true
        }
        binding.stopButton.setOnClickListener {
            showAlertDialog()
        }
    }

    private fun start() {
        this.timer = timer(initialDelay = 0, period = 100) {
            if (currentCountdownDeciSecond != 0) {
                currentCountdownDeciSecond -= 1

                runOnUiThread {
                    binding.countdownProgressBar.max = countdownSecond.times(10)
                    binding.countdownProgressBar.progress = currentCountdownDeciSecond
                    binding.countdownTextView.text =
                        String.format(
                            "%02d",
                            ceil(currentCountdownDeciSecond.toFloat().div(10f)).toInt()
                        )
                }
            } else {
                currentDeciSecond += 1

                val minutes = currentDeciSecond.div(10).div(60)
                val seconds = currentDeciSecond.div(10).mod(60)
                val deci = currentDeciSecond.mod(10)

                runOnUiThread {
                    binding.timeTextView.text = String.format("%02d:%02d", minutes, seconds)
                    binding.tickTextView.text = deci.toString()
                }
            }

            if (currentDeciSecond == 0 && currentCountdownDeciSecond < 31 && currentCountdownDeciSecond % 10 == 0) {
                Log.d("tone", "Beep!")
                val toneType =
                    if (currentCountdownDeciSecond == 0) ToneGenerator.TONE_CDMA_HIGH_L else ToneGenerator.TONE_CDMA_ANSWER
                ToneGenerator(AudioManager.STREAM_ALARM, ToneGenerator.MAX_VOLUME)
                    .startTone(toneType, 100)
            }
        }

    }

    private fun stop() {
        binding.startButton.isVisible = true
        binding.stopButton.isVisible = true
        binding.pauseButton.isVisible = false
        binding.lapButton.isVisible = false

        currentDeciSecond = 0
        timer?.cancel()
        timer = null

        binding.timeTextView.text = "00:00"
        binding.tickTextView.text = "0"

        currentCountdownDeciSecond = countdownSecond.times(10)
        binding.countdownTextView.text = String.format("%02d", countdownSecond)
        binding.lapContainerLinearLayout.removeAllViews()
    }

    private fun lap() {
        val container = binding.lapContainerLinearLayout
        TextView(this).apply {
            textSize = 20f
            gravity = Gravity.CENTER
            setPadding(30)

            val minutes = currentDeciSecond.div(10).div(60)
            val seconds = currentDeciSecond.div(10).mod(60)
            val deci = currentDeciSecond.mod(10)

            text = "${container.childCount.inc()}. " + String.format(
                "%02d:%02d %01d",
                minutes,
                seconds,
                deci
            )
        }.let { tv ->
            container.addView(tv, 0)
        }
    }

    private fun pause() {
        timer?.cancel()
        timer = null
    }

    private fun showCountdownSettingDialog() {
        AlertDialog.Builder(this).apply {
            val dialogBinding = DialogCountdownSettingBinding.inflate(layoutInflater)
            with(dialogBinding.countdownSecondPicker) {
                maxValue = 20
                minValue = 0
                value = countdownSecond
            }
            setTitle("카운트다운 설정")
            setView(dialogBinding.root)
            setPositiveButton("확인") { dialog, id ->
                countdownSecond = dialogBinding.countdownSecondPicker.value
                currentCountdownDeciSecond = countdownSecond.times(10)
                binding.countdownTextView.text = String.format("%02d", countdownSecond)
            }
            setNegativeButton("취소", null)
        }.show()
    }

    private fun showAlertDialog() {
        AlertDialog.Builder(this).apply {
            setMessage("종료하시겠습니까?")
            setPositiveButton("네") { dialog, id ->
                stop()
            }
            setNegativeButton("아니오", null)
        }.show()
    }
}