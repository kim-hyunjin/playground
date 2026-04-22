package com.github.kimhyunjin.agecalculator

import android.app.DatePickerDialog
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import java.text.SimpleDateFormat
import java.util.*

class MainActivity : AppCompatActivity() {

    private var tvSelectedDate: TextView? = null;
    private var tvAgeInMinutes: TextView? = null;
    private var tvAgeInHours: TextView? = null;
    private val sdf = SimpleDateFormat("dd/MM/yyyy", Locale.ENGLISH)

    private val onDateSetListener =
        DatePickerDialog.OnDateSetListener { _, selectedYear, selectedMonth, selectedDayOfMonth ->
//            Toast.makeText(
//                this,
//                "$selectedYear, ${selectedMonth + 1}, $selectedDayOfMonth",
//                Toast.LENGTH_LONG
//            ).show()

            val selectedDate = "$selectedDayOfMonth/${selectedMonth+1}/$selectedYear"
            tvSelectedDate?.text = selectedDate

            val theDate = sdf.parse(selectedDate)

            theDate?.let {
                val diffMinutes = (System.currentTimeMillis() - it.time) / (60 * 1000)
                tvAgeInMinutes?.text = diffMinutes.toString()

                val diffHours = diffMinutes / 60
                tvAgeInHours?.text = diffHours.toString()
            }


        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val btnDatePicker: Button = findViewById(R.id.btnDatePicker)
        tvSelectedDate = findViewById(R.id.tvSelectedDate)
        tvAgeInMinutes = findViewById(R.id.tvAgeMinutes)
        tvAgeInHours = findViewById(R.id.tvAgeHours)

        btnDatePicker.setOnClickListener {
            clickDatPicker()
        }
    }

    private fun clickDatPicker() {

        val myCalendar = Calendar.getInstance()
        val year = myCalendar.get(Calendar.YEAR)
        val month = myCalendar.get(Calendar.MONTH)
        val day = myCalendar.get(Calendar.DAY_OF_MONTH)
        val dpd = DatePickerDialog(this, onDateSetListener, year, month, day)
        dpd.datePicker.maxDate = System.currentTimeMillis() - (86400000) // yesterday
        dpd.show()
    }
}