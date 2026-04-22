package com.github.kimhyunjin.mycontentprovider

import android.os.Bundle
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.github.kimhyunjin.mycontentprovider.databinding.ActivityMainBinding
import com.github.kimhyunjin.mycontentprovider.provider.MyContentResolveHelper
import java.text.SimpleDateFormat
import java.util.Date

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var contentResolverHelper: MyContentResolveHelper
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        ViewCompat.setOnApplyWindowInsetsListener(binding.main) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
        contentResolverHelper = MyContentResolveHelper(this)
        binding.insertBtn.setOnClickListener {
            Thread {
                val sdf = SimpleDateFormat("HH:mm:ss")
                contentResolverHelper.insertItem("내부", "Content - ${sdf.format(Date())}")
                runOnUiThread { Toast.makeText(this, "Add!", Toast.LENGTH_SHORT).show() }
            }.start()
        }
        binding.queryBtn.setOnClickListener {
            Thread {
                val allItems = contentResolverHelper.getAllItems().toString()
                runOnUiThread {
                    binding.resultTextView.text = allItems
                }
            }.start()
        }
        binding.deleteBtn.setOnClickListener {
            Thread {
                val latest = contentResolverHelper.getAllItems().last()
                contentResolverHelper.removeItem(latest.itemId)
                runOnUiThread { Toast.makeText(this, "Removed", Toast.LENGTH_SHORT).show() }
            }.start()
        }
    }

}