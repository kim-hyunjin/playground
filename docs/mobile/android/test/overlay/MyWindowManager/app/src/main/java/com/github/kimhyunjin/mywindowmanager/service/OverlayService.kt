package com.github.kimhyunjin.mywindowmanager.service

import android.annotation.SuppressLint
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.os.IBinder
import android.util.Log
import android.util.TypedValue
import android.view.Gravity
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.View.OnTouchListener
import android.view.WindowManager
import android.webkit.JavascriptInterface
import android.webkit.WebViewClient
import com.github.kimhyunjin.mywindowmanager.R
import com.github.kimhyunjin.mywindowmanager.databinding.ContentMainBinding


class OverlayService : Service() {
    private lateinit var windowManager: WindowManager
    private lateinit var params: WindowManager.LayoutParams
    private lateinit var binding: ContentMainBinding
    private var initialX: Int = 0
    private var initialY: Int = 0
    private var initialTouchX: Float = 0f
    private var initialTouchY: Float = 0f


    override fun onBind(p0: Intent?): IBinder? {
        return null
    }

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        val inflater = getSystemService(LAYOUT_INFLATER_SERVICE) as LayoutInflater
        binding = ContentMainBinding.inflate(inflater)

        params = WindowManager.LayoutParams(
            dpToPx(this, 300f),
            dpToPx(this, 350f),
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            PixelFormat.TRANSLUCENT
        )
        params.gravity = Gravity.CENTER
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        showOverlay()
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        val webView = binding.webview
        webView.destroy()
        windowManager.removeView(binding.root)
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun showOverlay() {
        // 오버레이 뷰를 윈도우 매니저에 추가
        windowManager.addView(binding.root, params)

        val webView = binding.webview
        webView.webViewClient = WebViewClient()
        webView.addJavascriptInterface(WebAppInterface(this, binding), "Android")
        webView.settings.javaScriptEnabled = true
        webView.loadUrl("http://10.1.1.228:5173")

        setTouchHandlerForWindowMove()

        binding.toWebViewBtn.setOnClickListener {
            sendMessageToWebView(binding.editText.text.toString())
            binding.editText.text.clear()
        }
    }

    @SuppressLint("ClickableViewAccessibility")
    private fun setTouchHandlerForWindowMove() {
        binding.root.setOnTouchListener(object : OnTouchListener {
            override fun onTouch(v: View?, event: MotionEvent?): Boolean {
                when (event?.action) {
                    MotionEvent.ACTION_DOWN -> {
                        initialX = params.x
                        initialY = params.y
                        initialTouchX = event.rawX
                        initialTouchY = event.rawY
                        return true
                    }

                    MotionEvent.ACTION_MOVE -> {
                        params.x = initialX + (event.rawX - initialTouchX).toInt()
                        params.y = initialY + (event.rawY - initialTouchY).toInt()
                        windowManager.updateViewLayout(binding.root, params)
                        return true
                    }
                }
                return false
            }
        })
    }

    private fun dpToPx(context: Context, dp: Float): Int {
        val px = TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP,
            dp,
            context.resources.displayMetrics
        )
        return px.toInt()
    }

    private fun sendMessageToWebView(message: String) {
        // Execute JavaScript function in WebView
        binding.webview.evaluateJavascript("javascript:receiveMessageFromAndroid('$message')", null)
    }

    class WebAppInterface(private val context: Context, private val binding: ContentMainBinding) {
        @JavascriptInterface
        fun send(message: String) {
            Log.i("send", message)
            binding.textView.text = context.getString(R.string.webview_says, message)
        }
    }
}