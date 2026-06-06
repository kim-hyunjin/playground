package com.github.kimhyunjin.architecturepattern.mvp

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import coil.load
import com.github.kimhyunjin.architecturepattern.R
import com.github.kimhyunjin.architecturepattern.databinding.ActivityMvpBinding
import com.github.kimhyunjin.architecturepattern.mvp.model.ImageCountModel
import com.github.kimhyunjin.architecturepattern.mvp.repository.ImageRepositoryImpl

/**
 * Activity(View)와 Presenter는 1대1 관계
 */
class MvpActivity : AppCompatActivity(), MvpContractor.View {

    private lateinit var binding: ActivityMvpBinding
    private lateinit var presenter: MvpContractor.Presenter
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMvpBinding.inflate(layoutInflater).also {
            setContentView(it.root)
            it.view = this
        }
        presenter = MvpPresenter(ImageCountModel(), ImageRepositoryImpl())
        presenter.attachView(this)
    }

    /**
     * presenter에세 이벤트 발생 알림
     */
    fun onClickLoadImage() {
        presenter.loadRandomImage()
    }

    override fun showImage(url: String) {
        binding.imageView.run {
            load(url)
        }
    }

    override fun showImageCountText(count: Int) {
        binding.imageCountTextView.text = "불러온 이미지 수 : $count"
    }
}