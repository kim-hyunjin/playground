package com.github.kimhyunjin.weatherapp

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Geocoder
import android.location.Location
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import com.github.kimhyunjin.weatherapp.WeatherRepository.fetchForecast
import com.github.kimhyunjin.weatherapp.databinding.ActivityMainBinding
import com.github.kimhyunjin.weatherapp.databinding.ItemForecastBinding
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import java.util.Locale

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var fusedLocationClient: FusedLocationProviderClient

    private val locationRequestPermission =
        registerForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { permissions ->
            when {
                permissions.getOrDefault(Manifest.permission.ACCESS_COARSE_LOCATION, false) -> {
                    updateForecastWithLastLocation()
                }

                else -> {
                    Toast.makeText(this, "위치 권한이 필요합니다.", Toast.LENGTH_SHORT).show()
                    val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                        data = Uri.fromParts("package", packageName, null)
                    }
                    startActivity(intent)
                    finish()
                }
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        locationRequestPermission.launch(arrayOf(Manifest.permission.ACCESS_COARSE_LOCATION))
    }

    private fun updateForecastWithLastLocation() {
        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            locationRequestPermission.launch(arrayOf(Manifest.permission.ACCESS_COARSE_LOCATION))
            return
        }

//        fusedLocationClient.lastLocation.addOnSuccessListener {
//            if (it != null) {
//                Log.i("Location", "${it.latitude}, ${it.longitude}")
//                updateLocationTextView(it)
//                fetchForecast(it)
//            }
//        }
        val targetLocation = Location("") //provider name is unnecessary
        targetLocation.latitude = 37.5635694444444
        targetLocation.longitude = 126.980008333333
        updateLocationTextView(targetLocation)
        fetchForecast(targetLocation, onSuccess = {
            updateForecastUI(it)
        })
    }

    private fun updateLocationTextView(location: Location) {
        Thread {
            val addressList = Geocoder(this, Locale.KOREA).getFromLocation(
                location.latitude,
                location.longitude,
                1
            )
            addressList?.first().let {
                runOnUiThread {
                    binding.locationTextView.text = it?.thoroughfare
                }
            }
        }.start()
    }

    private fun updateForecastUI(forecasts: List<Forecast>) {
        val currentForecast = forecasts.first()
        binding.temperatureTextView.text =
            getString(R.string.temperature_text, currentForecast.temperature)
        binding.skyTextView.text = currentForecast.weather
        binding.precipitationTextView.text =
            getString(R.string.precipication_text, currentForecast.precipitation)
        binding.childForecastLayout.apply {

            forecasts.forEachIndexed { index, forecast ->
                if (index == 0) {
                    return@forEachIndexed
                }
                val itemView = ItemForecastBinding.inflate(layoutInflater)
                itemView.timeTextView.text = forecast.time
                itemView.weatherTextView.text = forecast.weather
                itemView.temperatureTextView.text =
                    getString(R.string.temperature_text, forecast.temperature)

                addView(itemView.root)
            }

        }
    }
}