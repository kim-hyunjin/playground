package com.github.kimhyunjin.widgetsprogressbar

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import com.github.kimhyunjin.widgetsprogressbar.databinding.ActivityMainBinding
import kotlin.concurrent.thread

class MainActivity : AppCompatActivity() {

    private val binding by lazy { ActivityMainBinding.inflate(layoutInflater) }
    private var count = 0
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(binding.root)

        /**
         * 화면을 그리는 메인 스레드
         * 안드로이드는 메인 스레드(Main Thread)라는 개념이 있는데,
         * 화면에 그림을 그려주는 것이 메인 스레드의 역할이다.(aka UI Thread)
         *
         * 즉 UI와 관련된 모든 코드는 메인 스레드에서 실행되어야만 한다.
         *
         * onCreate() 메서드 안의 모든 코드는 메인 스레드에서 동작한다.
         *
         */
        thread(start=true) {
//            Thread.sleep(3000)
//            runOnUiThread {
//                showProgress(false)
//            }
            while (true) {
                Thread.sleep(1000)
                count++

                runOnUiThread {
                    binding.textView.text = "$count"
                    if (count == 10) showProgress(false)
                }

            }
        }
    }

    private fun showProgress(show: Boolean) {
        if (show) {
            binding.progressLayout.visibility = View.VISIBLE
        } else {
            binding.progressLayout.visibility = View.GONE // GONE: 보이지도 않고, 공간도 차지하지 않는다.
        }
        // View.INVISIBLE : 보이지는 않지만 공간을 차지한다.
    }
}