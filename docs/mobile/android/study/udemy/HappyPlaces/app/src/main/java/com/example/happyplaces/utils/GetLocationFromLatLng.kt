package com.example.happyplaces.utils

import android.content.Context
import android.location.Geocoder
import android.os.AsyncTask
import java.util.Locale

class GetLocationFromLatLng(context: Context, private val latitude: Double, private val longitude: Double, private val listener: AddressListener): AsyncTask<Void, String, String>() {

    private val geocoder: Geocoder = Geocoder(context, Locale.getDefault())

    fun getLocation() {
        execute()
    }

    override fun doInBackground(vararg params: Void?): String {
        try {
            val addresses = geocoder.getFromLocation(latitude, longitude, 1)
            if (!addresses.isNullOrEmpty()) {
                val address = addresses[0]
                val sb = StringBuilder()
                for (i in 0..address.maxAddressLineIndex) {
                    sb.append(address.getAddressLine(i)).append(" ")
                }
                sb.deleteCharAt(sb.length - 1)
                return sb.toString()
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return ""
    }

    override fun onPostExecute(result: String?) {
        if (result != null) {
            listener.onAddressFound(result)
        } else {
            listener.onError()
        }
        super.onPostExecute(result)
    }

    interface AddressListener {
        fun onAddressFound(address: String?)
        fun onError()
    }
}