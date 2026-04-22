package com.github.kimhyunjin.architecturepattern.mvc

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import coil.load
import com.github.kimhyunjin.architecturepattern.databinding.ActivityMvcBinding

/**
 * Activity 클래스가 controller 역할
 * 여기서 모델의 데이터 변경
 * 뷰에 변경된 모델 데이터 적용
 */
class MvcActivity : AppCompatActivity(), ImageProvider.Callback {
    private lateinit var binding: ActivityMvcBinding
    private val model = ImageCountModel()
    private val imageProvider = ImageProvider(this)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMvcBinding.inflate(layoutInflater).also {
            setContentView(it.root)
            it.view = this
        }
    }

    fun loadImage() {
        imageProvider.getRandomImage()
    }

    override fun onLoadImage(url: String) {
        model.increase()
        with(binding) {
            imageView.run {
                load(url)
            }

            imageCountTextView.text = "불러온 이미지 수 : ${model.count}"
        }
    }
}