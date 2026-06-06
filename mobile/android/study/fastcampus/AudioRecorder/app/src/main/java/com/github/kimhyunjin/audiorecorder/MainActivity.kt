package com.github.kimhyunjin.audiorecorder

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.content.res.ColorStateList
import android.graphics.Color
import android.media.MediaPlayer
import android.media.MediaRecorder
import android.net.Uri
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import android.view.View
import androidx.appcompat.app.AlertDialog
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.github.kimhyunjin.audiorecorder.databinding.ActivityMainBinding
import java.io.IOException

class MainActivity : AppCompatActivity(), Timer.OnTimerTickListener {

    private lateinit var binding: ActivityMainBinding
    private lateinit var timer: Timer

    private var recorder: MediaRecorder? = null
    private var player: MediaPlayer? = null
    private var fileName: String = ""

    private enum class State {
        RELEASE, RECORDING, PLAYING, PAUSE
    }

    private var state: State = State.RELEASE

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        fileName = "${externalCacheDir?.absoluteFile}/record_test.3gp"
        timer = Timer(this, 40L)

        binding.recordButton.setOnClickListener {
            when (state) {
                State.RELEASE -> {
                    record()
                }

                State.RECORDING -> {
                    stopRecording()
                }

                else -> {

                }
            }
        }

        binding.playButton.setOnClickListener {
            when (state) {
                State.RELEASE -> {
                    startPlaying()
                }

                State.PLAYING -> {
                    pausePlaying()
                }

                State.PAUSE -> {
                    resumePlaying()
                }

                else -> {

                }
            }
        }
        binding.playButton.disable()

        binding.stopButton.setOnClickListener {
            stopPlaying()
        }
    }

    private fun record() {
        when {
            ContextCompat.checkSelfPermission(
                this@MainActivity,
                Manifest.permission.RECORD_AUDIO
            ) == PackageManager.PERMISSION_GRANTED -> {
                startRecording()
            }

            ActivityCompat.shouldShowRequestPermissionRationale(
                this,
                Manifest.permission.RECORD_AUDIO
            ) -> {
                showPermissionRationalDialog()
            }

            else -> {
                ActivityCompat.requestPermissions(
                    this,
                    arrayOf(Manifest.permission.RECORD_AUDIO),
                    REQUEST_RECORD_AUDIO
                )
            }
        }
    }

    private fun showPermissionRationalDialog() {
        AlertDialog.Builder(this).apply {
            setMessage("녹음을 위해 권한이 필요합니다.")
            setPositiveButton("권한 허용하기") { _, _ ->
                ActivityCompat.requestPermissions(
                    this@MainActivity,
                    arrayOf(Manifest.permission.RECORD_AUDIO),
                    REQUEST_RECORD_AUDIO
                )
            }
            setNegativeButton("거절하기") { dialog, _ ->
                dialog.cancel()
            }
        }.show()
    }

    private fun showPermissionSettingDialog() {
        AlertDialog.Builder(this).apply {
            setMessage("녹음권한이 필요합니다. 앱 설정 화면에서 권한을 켜주세요.")
            setPositiveButton("권한 변경하러 가기") { _, _ ->
                navigateToSetting()
            }
            setNegativeButton("거절하기") { dialog, _ ->
                dialog.cancel()
            }
        }.show()
    }

    private fun navigateToSetting() {
        val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
            data = Uri.fromParts("package", packageName, null)
        }
        startActivity(intent)
    }

    private fun startRecording() {
        state = State.RECORDING
        recorder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            MediaRecorder(this)
        } else {
            MediaRecorder()
        }
        recorder?.apply {
            setAudioSource(MediaRecorder.AudioSource.MIC)
            setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP)
            setOutputFile(fileName)
            setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB)

            try {
                prepare()
            } catch (e: IOException) {
                Log.e("APP", "MediaRecorder prepare() failed $e")
            }

            binding.waveFormView.clearData()
            start()
            timer.start()
        }

        binding.recordButton.setImageDrawable(
            ContextCompat.getDrawable(
                this,
                R.drawable.baseline_stop_24
            )
        )
        binding.recordButton.imageTintList = ColorStateList.valueOf(Color.BLACK)
        binding.playButton.disable()
        binding.stopButton.disable()
    }

    private fun stopRecording() {
        state = State.RELEASE
        recorder?.apply {
            stop()
            timer.stop()
            release()
        }

        binding.recordButton.setImageDrawable(
            ContextCompat.getDrawable(
                this,
                R.drawable.baseline_fiber_manual_record_24
            )
        )
        binding.recordButton.imageTintList = ColorStateList.valueOf(Color.RED)
        binding.playButton.enable()
        binding.stopButton.enable()
    }

    private fun startPlaying() {
        state = State.PLAYING

        player = MediaPlayer().apply {
            setDataSource(fileName)
            try {
                prepare()
            } catch (e: IOException) {
                Log.e("APP", "MediaPlayer prepare() failed $e")
            }

            binding.tvTimer.text = "00:00:00"
            start()
            binding.waveFormView.clearWave()
            timer.clearDuration()
            timer.start()

            setOnCompletionListener {
                state = State.RELEASE
                binding.recordButton.enable()
                binding.playButton.setImageResource(R.drawable.baseline_play_arrow_24)
                timer.stop()
                timer.clearDuration()
            }
        }

        binding.recordButton.disable()
        binding.playButton.setImageResource(R.drawable.baseline_pause_24)
    }

    private fun pausePlaying() {
        player?.apply {
            state = State.PAUSE
            pause()
            timer.stop()
        }

        binding.playButton.setImageResource(R.drawable.baseline_play_arrow_24)
    }

    private fun resumePlaying() {
        player?.apply {
            state = State.PLAYING
            start()
            timer.start()
        }

        binding.playButton.setImageResource(R.drawable.baseline_pause_24)
    }

    private fun stopPlaying() {
        state = State.RELEASE

        player?.release()
        timer.stop()
        player = null

        binding.tvTimer.text = "00:00:00"
        binding.waveFormView.clearWave()
        binding.playButton.setImageResource(R.drawable.baseline_play_arrow_24)
        binding.recordButton.enable()
    }

    fun View.disable() {
        isEnabled = false
        alpha = 0.3f
    }

    fun View.enable() {
        isEnabled = true
        alpha = 1.0f
    }


    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        val audioRecordPermissionGranted =
            requestCode == REQUEST_RECORD_AUDIO && grantResults.firstOrNull() == PackageManager.PERMISSION_GRANTED

        if (audioRecordPermissionGranted) {
            startRecording()
        } else {
            showPermissionSettingDialog()
        }
    }

    companion object {
        private const val REQUEST_RECORD_AUDIO = 100
    }

    override fun onTick(duration: Long) {
        val milliSec = duration % 1000
        val sec = (duration / 1000) % 60
        val min = (duration / 1000 / 60)
        binding.tvTimer.text = String.format("%02d:%02d:%02d", min, sec, milliSec / 10)

        if (state == State.PLAYING) {
            binding.waveFormView.replayAmplitude()
        } else if (state == State.RECORDING) {
            binding.waveFormView.addAmplitude(recorder?.maxAmplitude?.toFloat() ?: 0f)
        }
    }
}