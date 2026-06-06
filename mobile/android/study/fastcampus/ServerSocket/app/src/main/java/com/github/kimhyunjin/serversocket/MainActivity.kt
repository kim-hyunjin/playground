package com.github.kimhyunjin.serversocket

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.core.view.isVisible
import com.google.gson.Gson
import okhttp3.Call
import okhttp3.Callback
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import java.io.IOException


class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val editText = findViewById<EditText>(R.id.etServerHost)
        val confirmButton = findViewById<Button>(R.id.btnConfirm)
        val tvInfo = findViewById<TextView>(R.id.tvInfo)

        val client = OkHttpClient()
        val callback = object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    Toast.makeText(this@MainActivity, "수신에 실패했습니다.", Toast.LENGTH_SHORT).show()
                }
                Log.e("Client", e.toString())
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    val body = response.body?.string()
                    Log.i("Client", "body - $body")
                    val message = Gson().fromJson(body, Message::class.java)
                    Log.i("Client", "message - $message")
                    runOnUiThread {
                        tvInfo.text = message.message
                        tvInfo.isVisible = true

                        editText.isVisible = false
                        confirmButton.isVisible = false
                    }
                } else {
                    runOnUiThread {
                        Toast.makeText(this@MainActivity, "수신에 실패했습니다.", Toast.LENGTH_SHORT).show()
                    }
                }

            }

        }

        confirmButton.setOnClickListener {
            val request = Request.Builder().url(editText.text.toString()).build()
            client.newCall(request).enqueue(callback)
        }


//        Thread {
//            try {
//                // emulator에서 로컬호스트에 접근하려면 10.0.2.2 사용
//                val socket = Socket("10.0.2.2", 8080)
//                val writer = PrintWriter(socket.getOutputStream())
//                val reader = BufferedReader(InputStreamReader(socket.getInputStream()))
//
//                writer.println("GET / HTTP/1.1")
//                writer.println("Host: 127.0.0.1:8080")
//                writer.println("User-Agent: android")
//                writer.println("\r\n")
//                writer.flush()
//
//                var input: String? = "-1"
//                while(input != null) {
//                    input = reader.readLine()
//                    Log.i("Client", input)
//                }
//                reader.close()
//                writer.close()
//                socket.close()
//            } catch (e: Exception) {
//                Log.e("Client", e.toString())
//            }
//        }.start()
    }
}