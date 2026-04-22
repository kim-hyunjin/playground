package com.example.happyplaces.activities

import android.Manifest
import android.annotation.SuppressLint
import android.app.AlertDialog
import android.app.DatePickerDialog
import android.content.Context
import android.content.ContextWrapper
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.ImageDecoder
import android.location.Address
import android.location.Geocoder
import android.location.LocationManager
import android.net.Uri
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Looper
import android.provider.MediaStore
import android.provider.Settings
import android.util.Log
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.lifecycle.lifecycleScope
import com.example.happyplaces.HappyPlaceApp
import com.example.happyplaces.IMAGE_DIRECTORY
import com.example.happyplaces.R
import com.example.happyplaces.READ_IMAGE_PERMISSION
import com.example.happyplaces.databinding.ActivityAddHappyPlaceBinding
import com.example.happyplaces.models.PlaceEntity
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.android.libraries.places.api.Places
import com.google.android.libraries.places.api.model.Place
import com.google.android.libraries.places.widget.Autocomplete
import com.google.android.libraries.places.widget.model.AutocompleteActivityMode
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.io.OutputStream
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale
import java.util.UUID

class AddHappyPlaceActivity : AppCompatActivity() {
    private lateinit var binding: ActivityAddHappyPlaceBinding
    private var calendar = Calendar.getInstance()
    private lateinit var dateSetListener: DatePickerDialog.OnDateSetListener
    private lateinit var imageSourceChooseDialog: AlertDialog
    private var placeImage: Uri? = null

    private var mLatitude: Double = 0.0
    private var mLongitude: Double = 0.0

    private lateinit var mFusedLocationProviderClient: FusedLocationProviderClient
    private lateinit var mGeocoder: Geocoder
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAddHappyPlaceBinding.inflate(layoutInflater)

        initSupportActionBar()

        dateSetListener = DatePickerDialog.OnDateSetListener { view, year, month, dayOfMonth ->
            calendar.set(Calendar.YEAR, year)
            calendar.set(Calendar.MONTH, month)
            calendar.set(Calendar.DAY_OF_MONTH, dayOfMonth)
            updateDateInView()
        }

        imageSourceChooseDialog =
            AlertDialog.Builder(this@AddHappyPlaceActivity).setTitle("장소 사진 추가하기").setItems(
                arrayOf("갤러리", "카메라")
            ) { dialog, which ->
                when (which) {
                    0 -> {
                        requestOpenGallery()
                    }
                    1 -> {
                        requestCamera()
                    }
                }
            }.create()

        mFusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(this)
        mGeocoder = Geocoder(this, Locale.getDefault())

        setupEventListener()
        setupGoogleMap()
    }

    private fun initSupportActionBar() {
        setContentView(binding.root)
        setSupportActionBar(binding.toolbarAddPlace)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
    }

    private fun setupEventListener() {
        binding.etDate.setOnClickListener {
            DatePickerDialog(
                this@AddHappyPlaceActivity,
                dateSetListener,
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH),
                calendar.get(Calendar.DAY_OF_MONTH)
            ).show()
        }

        binding.tvAddImage.setOnClickListener {
            imageSourceChooseDialog.show()
        }

        binding.btnSave.setOnClickListener {
            handleSaveButtonClick()
        }

        binding.etLocation.setOnClickListener {
            try {
                val fields = listOf(Place.Field.ID, Place.Field.NAME, Place.Field.LAT_LNG, Place.Field.ADDRESS)
                val intent = Autocomplete.IntentBuilder(AutocompleteActivityMode.FULLSCREEN, fields).build(this)
                googleMapLauncher.launch(intent)
            } catch (e: Exception) {

            }
        }

        binding.btnCurrentLocation.setOnClickListener {
            val locationManager: LocationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager

            val isLocationEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) || locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)
            if (!isLocationEnabled) {
                toast("Your location setting is turned off. Please turn it on...")
                val intent = Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)
                startActivity(intent)
            } else {
                requestPermissionsLauncher.launch(arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION))
            }
        }
    }

    private fun setupGoogleMap() {
        if (!Places.isInitialized()) {
            Places.initialize(this, resources.getString(R.string.google_maps_key))
        }
    }

    private fun updateDateInView() {
        val sdf = SimpleDateFormat("dd.MM.yyyy", Locale.getDefault())
        binding.etDate.setText(sdf.format(calendar.time).toString())
    }

    /**
     * 갤러리
     */
    private fun requestOpenGallery() {
        if (checkSelfPermission(READ_IMAGE_PERMISSION) == PackageManager.PERMISSION_DENIED) {
            requestPermissionsLauncher.launch(arrayOf(READ_IMAGE_PERMISSION))
        } else {
            openGallery()
        }
    }

    private fun openGallery() {
        val imagePickIntent =
            Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
        openGalleryLauncher.launch(imagePickIntent)
    }

    private val openGalleryLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == RESULT_OK && result.data != null) {
            val contentUri = result.data!!.data!!

            contentUri.let {
                val bitmap = if (Build.VERSION.SDK_INT < 28) {
                    MediaStore.Images.Media.getBitmap(contentResolver, contentUri)
                } else {
                    val source = ImageDecoder.createSource(contentResolver, contentUri)
                    ImageDecoder.decodeBitmap(source)
                }
                binding.ivPlaceImage.setImageBitmap(bitmap)
                lifecycleScope.launch(Dispatchers.IO) {
                    placeImage = saveImageToInternalStorage(bitmap)
                }
            }
        }
    }

    /**
     * 카메라
     */

    private fun requestCamera() {
        if (checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_DENIED) {
            requestPermissionsLauncher.launch(arrayOf(Manifest.permission.CAMERA))
        } else {
            openCamera()
        }
    }

    private fun openCamera() {
        val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        openCameraLauncher.launch(intent)
    }

    private val openCameraLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == RESULT_OK && result.data != null) {
            val thumbnail = result.data!!.extras!!.get("data") as Bitmap
            binding.ivPlaceImage.setImageBitmap(thumbnail)
            lifecycleScope.launch(Dispatchers.IO) {
                placeImage = saveImageToInternalStorage(thumbnail)
            }
        }
    }

    private val requestPermissionsLauncher =
        registerForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { permissions ->
            permissions.entries.forEach {
                val permissionName = it.key
                val isGranted = it.value
                if (!isGranted) {
                    Toast.makeText(
                        this,
                        "Oops, you just denied the permission.",
                        Toast.LENGTH_LONG
                    ).show()
                    return@forEach
                }
                when (permissionName) {
                    READ_IMAGE_PERMISSION -> {
                        openGallery()
                    }
                    Manifest.permission.CAMERA -> {
                        openCamera()
                    }
                    Manifest.permission.ACCESS_FINE_LOCATION -> {
                        requestNewLocationData()
                    }
                }

            }
        }

    private suspend fun saveImageToInternalStorage(bitmap: Bitmap): Uri {
        var result: Uri
        withContext(Dispatchers.IO) {
            val wrapper = ContextWrapper(applicationContext)
            var file = wrapper.getDir(IMAGE_DIRECTORY, Context.MODE_PRIVATE)
            file = File(file, "${UUID.randomUUID()}.jpg")

            try {
                val stream: OutputStream = FileOutputStream(file)
                bitmap.compress(Bitmap.CompressFormat.JPEG, 100, stream)
                stream.flush()
                stream.close()
            } catch (e: IOException) {
                Log.e("saveImageToInternalStorage: ERROR", e.message.toString())
            }

            Log.i("saveImageToInternalStorage: SUCCESS", file.absolutePath)
            result =  Uri.parse(file.absolutePath)
        }
        return result
    }

    /**
     * location
     */
    private val googleMapLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == RESULT_OK && result.data != null) {
            result.data?.let {
                val place = Autocomplete.getPlaceFromIntent(it)
                binding.etLocation.setText(place.address)
                mLatitude = place.latLng!!.latitude
                mLongitude = place.latLng!!.longitude
            }

        }
    }

    @SuppressLint("MissingPermission")
    private fun requestNewLocationData() {
        val mLocationRequest = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, 1000).apply {
            setMaxUpdates(1)
        }.build()
//        if (ActivityCompat.checkSelfPermission(
//                this,
//                Manifest.permission.ACCESS_FINE_LOCATION
//            ) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(
//                this,
//                Manifest.permission.ACCESS_COARSE_LOCATION
//            ) != PackageManager.PERMISSION_GRANTED
//        ) {
//            // TODO: Consider calling
//            //    ActivityCompat#requestPermissions
//            // here to request the missing permissions, and then overriding
//            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
//            //                                          int[] grantResults)
//            // to handle the case where the user grants the permission. See the documentation
//            // for ActivityCompat#requestPermissions for more details.
//            return
//        }
        mFusedLocationProviderClient.requestLocationUpdates(mLocationRequest, mLocationCallback, Looper.myLooper())
    }

    private val mLocationCallback = object: LocationCallback() {
        override fun onLocationResult(result: LocationResult) {
            super.onLocationResult(result)
            val mLastLocation = result.lastLocation!!
            mLatitude = mLastLocation.latitude
            mLongitude = mLastLocation.longitude
            Log.i("lastLocation", "$mLatitude, $mLongitude")

            try {
                if (Build.VERSION.SDK_INT > 33) {
                    mGeocoder.getFromLocation(
                        mLatitude,
                        mLongitude,
                        1,
                        object : Geocoder.GeocodeListener {
                            override fun onGeocode(addresses: MutableList<Address>) {
                                lifecycleScope.launch(Dispatchers.Main) {
                                    setLocationFromAddress(addresses)
                                }
                            }

                            override fun onError(errorMessage: String?) {
                                super.onError(errorMessage)
                            }
                        })
                } else {
//                    GetLocationFromLatLng(latitude = mLatitude, longitude = mLongitude, context = this@AddHappyPlaceActivity, listener = object: GetLocationFromLatLng.AddressListener {
//                        override fun onAddressFound(address: String?) {
//                            binding.etLocation.setText(address)
//                        }
//                        override fun onError() {
//                            toast("Fail to get current location")
//                        }
//
//                    }).getLocation()
                    lifecycleScope.launch(Dispatchers.IO) {
                        val addrList = mGeocoder.getFromLocation(mLatitude, mLongitude, 1)
                        lifecycleScope.launch(Dispatchers.Main) {
                            setLocationFromAddress(addrList)
                        }
                    }
                }

            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun setLocationFromAddress(addresses: MutableList<Address>?) {
        if (!addresses.isNullOrEmpty()) {
            val address = addresses[0]
            val sb = StringBuilder()
            for (i in 0..address.maxAddressLineIndex) {
                sb.append(address.getAddressLine(i)).append(" ")
            }
            sb.deleteCharAt(sb.length - 1)
            binding.etLocation.setText(sb.toString())
        }
    }

    private fun handleSaveButtonClick() {
        when {
            binding.etTitle.text.isNullOrEmpty() -> {
                toast("제목을 입력해주세요.")
            }
            binding.etDescription.text.isNullOrEmpty() -> {
                toast("설명을 입력해주세요.")
            }
            binding.etDate.text.isNullOrEmpty() -> {
                toast("날짜를 입력해주세요.")
            }
            binding.etLocation.text.isNullOrEmpty() -> {
                toast("위치를 입력해주세요.")
            }
            placeImage == null -> {
                toast("사진을 추가해주세요.")
            } else -> {
            val entity = PlaceEntity(
                id = 0,
                title = binding.etTitle.text.toString(),
                description = binding.etDescription.text.toString(),
                image = placeImage.toString(),
                date = binding.etDate.text.toString(),
                location = binding.etLocation.text.toString(),
                latitude = mLatitude,
                longitude = mLongitude
            )
            val historyDao = (application as HappyPlaceApp).db.placeDao()
            lifecycleScope.launch {
                withContext(Dispatchers.IO) {
                    historyDao.insert(entity)
                }
                finish()
            }
        }
        }
    }

    private fun toast(text: String) {
        Toast.makeText(this, text, Toast.LENGTH_LONG).show()
    }
}