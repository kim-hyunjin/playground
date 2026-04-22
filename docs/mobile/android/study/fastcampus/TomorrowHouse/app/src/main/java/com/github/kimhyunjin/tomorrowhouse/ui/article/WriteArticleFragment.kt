package com.github.kimhyunjin.tomorrowhouse.ui.article

import android.net.Uri
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.View
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.view.isVisible
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.get
import androidx.navigation.fragment.findNavController
import com.github.kimhyunjin.tomorrowhouse.R
import com.github.kimhyunjin.tomorrowhouse.data.ArticleModel
import com.github.kimhyunjin.tomorrowhouse.databinding.FragmentWriteArticleBinding
import com.google.android.material.snackbar.Snackbar
import com.google.firebase.Firebase
import com.google.firebase.firestore.firestore
import com.google.firebase.storage.storage
import java.util.UUID

class WriteArticleFragment : Fragment(R.layout.fragment_write_article) {
    private lateinit var binding: FragmentWriteArticleBinding
    private lateinit var viewModel: WriteArticleViewModel
    val pickMedia = registerForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
        if (uri != null) {
            viewModel.updateSelectedUri(uri)
        }
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentWriteArticleBinding.bind(view)

        viewModel = ViewModelProvider(requireActivity()).get<WriteArticleViewModel>()
        viewModel.selectedUri.observe(viewLifecycleOwner) {
            binding.photoImageView.setImageURI(it)

            if (it != null) {
                binding.photoClearButton.isVisible = true
                binding.photoAddButton.isVisible = false
            } else {
                binding.photoClearButton.isVisible = false
                binding.photoAddButton.isVisible = true
            }
        }

        if (viewModel.selectedUri.value == null) {
            startImagePicker()
        }
        setupPhotoImageView()
        setupBackButton()
        setupSubmitButton()
        setupClearButton()
    }

    private fun startImagePicker() {
        pickMedia.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
    }

    private fun setupPhotoImageView() {
        binding.photoImageView.setOnClickListener {
            if (viewModel.selectedUri.value == null) {
                startImagePicker()
            }
        }
    }


    private fun setupBackButton() {
        binding.backButton.setOnClickListener {
            findNavController().navigate(WriteArticleFragmentDirections.actionBack())
        }
    }

    private fun setupSubmitButton() {
        binding.submitButton.setOnClickListener {
            showProgress()
            if (viewModel.selectedUri.value != null) {
                val photoUri = viewModel.selectedUri.value ?: return@setOnClickListener
                upload(photoUri)
            } else {
                showSnackBar("이미지가 선택되지 않았습니다.")
                hideProgress()
            }
        }
    }

    private fun upload(photoUri: Uri) {
        uploadImage(photoUri,
            onSuccess = { downloadUrl ->
                val description = binding.descriptionEditText.text.toString()
                uploadArticle(downloadUrl, description)
            }, onFail = {
                showSnackBar("이미지 업로드에 실패했습니다.")
                hideProgress()
            })
    }

    private fun uploadImage(
        photoUri: Uri,
        onSuccess: (String) -> Unit,
        onFail: (Throwable?) -> Unit
    ) {
        val fileName = "${UUID.randomUUID()}.png"
        Firebase.storage.reference
            .child("articles/photo")
            .child(fileName)
            .putFile(photoUri)
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    Firebase.storage.reference.child("articles/photo/$fileName")
                        .downloadUrl
                        .addOnSuccessListener { downloadUrl ->
                            Log.d("downloadUrl", downloadUrl.toString())
                            onSuccess(downloadUrl.toString())
                        }
                        .addOnFailureListener {
                            onFail(it)
                        }
                } else {
                    onFail(task.exception)
                }
            }
    }

    private fun uploadArticle(imageUrl: String, description: String) {
        val articleId = UUID.randomUUID().toString()
        val model = ArticleModel(
            articleId = articleId,
            createdAt = System.currentTimeMillis(),
            description = description,
            imageUrl = imageUrl
        )
        Firebase.firestore.collection("articles").document(articleId).set(model)
            .addOnSuccessListener {
                findNavController().navigate(WriteArticleFragmentDirections.actionWriteArticleFragmentToHomeFragment())
                hideProgress()
            }
            .addOnFailureListener {
                it.printStackTrace()
                showSnackBar("글 작성에 실패했습니다.")
                hideProgress()
            }

    }

    private fun showProgress() {
        binding.progressBarLayout.isVisible = true
    }

    private fun hideProgress() {
        binding.progressBarLayout.isVisible = false
    }

    private fun setupClearButton() {
        binding.photoClearButton.setOnClickListener {
            viewModel.updateSelectedUri(null)
        }
    }

    private fun showSnackBar(msg: String) {
        view?.let { view ->
            Snackbar.make(view, msg, Snackbar.LENGTH_SHORT).show()
        }
    }

}