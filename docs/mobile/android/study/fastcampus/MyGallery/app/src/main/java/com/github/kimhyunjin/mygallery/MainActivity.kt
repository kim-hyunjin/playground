package com.github.kimhyunjin.mygallery

import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.GridLayoutManager
import com.github.kimhyunjin.mygallery.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity(), ImageAdapter.ItemClickListener {
    private lateinit var binding: ActivityMainBinding
    private lateinit var imageAdapter: ImageAdapter

    private val imageLoadLauncher =
        registerForActivityResult(ActivityResultContracts.GetMultipleContents()) { uriList ->
            updateImages(uriList)
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.toolbar.apply {
            title = "사진 가져오기"
            setSupportActionBar(this)
        }

        imageAdapter = ImageAdapter(this)
        binding.btnLoadImg.setOnClickListener {
            checkPermission()
        }
        binding.btnGoToAlbum.setOnClickListener {
            navigateToAlbum()
        }

        initRecyclerView()
    }

    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        menuInflater.inflate(R.menu.main_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.actionAdd -> {
                checkPermission()
                true
            }

            else -> {
                super.onOptionsItemSelected(item)
            }
        }
    }

    private fun navigateToAlbum() {

        val intent = Intent(this, AlbumActivity::class.java).apply {
            val images = imageAdapter.currentList.filterIsInstance<ImageItems.Image>()
                .map { it -> it.uri.toString() }.toTypedArray()
            putExtra("images", images)
        }

        startActivity(intent)
    }

    private fun initRecyclerView() {
        binding.rvImage.apply {
            adapter = imageAdapter
            layoutManager = GridLayoutManager(this@MainActivity, 2)
        }
    }

    private fun checkPermission() {
        Log.d("test", "let's check permission")
        when {
            ContextCompat.checkSelfPermission(
                this,
                PERMISSION_FOR_READ_IMAGE
            ) == PackageManager.PERMISSION_GRANTED -> {
                loadImage()
            }

            shouldShowRequestPermissionRationale(android.Manifest.permission.READ_EXTERNAL_STORAGE) -> {
                showPermissionInfoDialog()
            }

            else -> {
                requestReadExternalStorage()
            }
        }

    }

    private fun showPermissionInfoDialog() {
        AlertDialog.Builder(this).apply {
            setMessage("이미지를 가져오기 권한이 필요합니다.")
            setNegativeButton("취소", null)
            setPositiveButton("동의") { _, _ ->
                requestReadExternalStorage()
            }
        }.show()
    }

    private fun requestReadExternalStorage() {
        Log.d("test", "requestReadExternalStorage")
        ActivityCompat.requestPermissions(
            this,
            arrayOf(PERMISSION_FOR_READ_IMAGE),
            REQUEST_EXTERNAL_STORAGE
        )
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        when (requestCode) {
            REQUEST_EXTERNAL_STORAGE -> {
                if (PackageManager.PERMISSION_GRANTED == grantResults.firstOrNull()) {
                    loadImage()
                }
            }
        }
    }

    private fun loadImage() {
        imageLoadLauncher.launch("image/*")
    }

    private fun updateImages(uriList: List<Uri>) {
        Log.i("uriList", uriList.toString())
        val images = uriList.map {
            ImageItems.Image(it)
        }
        val updatedImages = imageAdapter.currentList.toMutableList().apply { addAll(images) }
        imageAdapter.submitList(updatedImages)
    }

    companion object {
        private val PERMISSION_FOR_READ_IMAGE =
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                android.Manifest.permission.READ_MEDIA_IMAGES
            } else {
                android.Manifest.permission.READ_EXTERNAL_STORAGE
            }
        const val REQUEST_EXTERNAL_STORAGE = 100
    }

    override fun onClickLoadmore() {
        checkPermission()
    }
}