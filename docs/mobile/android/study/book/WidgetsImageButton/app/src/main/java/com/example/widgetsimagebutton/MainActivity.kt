package com.example.widgetsimagebutton

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import com.example.widgetsimagebutton.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    val binding by lazy { ActivityMainBinding.inflate(layoutInflater) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(binding.root)

        binding.radioGroup.setOnCheckedChangeListener { group, checkedId ->
            when(checkedId) {
                R.id.radioMercedes -> Log.d("RadioButton", "당신이 선택한 팀 : 메르세데스")
                R.id.radioRedbull -> Log.d("RadioButton", "당신이 선택한 팀 : 레드불")
                R.id.radioFerari -> Log.d("RadioButton", "당신이 선택한 팀 : 페라리")
            }
        }
    }
}