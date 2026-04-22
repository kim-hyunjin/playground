package com.github.kimhyunjin.widgetscheckbox

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.CompoundButton
import com.github.kimhyunjin.widgetscheckbox.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private val binding by lazy { ActivityMainBinding.inflate(layoutInflater) }
    private val listener by lazy {CompoundButton.OnCheckedChangeListener { buttonView, isChecked ->
        var fruit = ""
        when(buttonView.id) {
            R.id.checkApple -> fruit = "사과"
            R.id.checkBanana -> fruit = "바나나"
            R.id.checkOrange -> fruit = "오렌지"
        }
        changeFruits(fruit, isChecked)
        printFruits()
    }}

    private var fruits: MutableList<String> = mutableListOf()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(binding.root)

        binding.checkApple.setOnCheckedChangeListener(listener)
        binding.checkBanana.setOnCheckedChangeListener(listener)
        binding.checkOrange.setOnCheckedChangeListener(listener)

    }

    private fun changeFruits(fruit: String, isChecked: Boolean) {
        binding.selected.text = fruit
        if(isChecked) fruits.add(fruit) else fruits.remove(fruit)
    }

    private fun printFruits() {
        var msg = "selected: "
        fruits.forEachIndexed { index, item ->
            msg += if (index != fruits.size - 1) "$item, " else item
        }
        Log.d("CheckBox", msg)
    }
}