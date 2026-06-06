package com.github.kimhyunjin.architecturepattern.mvvm

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.activity.viewModels
import com.github.kimhyunjin.architecturepattern.R
import com.github.kimhyunjin.architecturepattern.databinding.ActivityMvvmBinding
import com.github.kimhyunjin.architecturepattern.mvvm.repository.ImageRepositoryImpl

/**
 * Activity는 ViewModel에 대해서 알지만, ViewModel은 Activity에 대해 알지 못한다.
 * ViewModel의 LiveData를 구독 -> UI 업데이트
 */
class MvvmActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMvvmBinding
    private val viewModel: MvvmViewModel by viewModels {
        MvvmViewModel.MvvmViewModelFactory(ImageRepositoryImpl())
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMvvmBinding.inflate(layoutInflater).also {
            setContentView(it.root)
            it.lifecycleOwner = this
            it.view = this
            it.viewModel = viewModel
        }
    }

    fun onClickLoadImage() {
        viewModel.loadRandomImage()
    }
}