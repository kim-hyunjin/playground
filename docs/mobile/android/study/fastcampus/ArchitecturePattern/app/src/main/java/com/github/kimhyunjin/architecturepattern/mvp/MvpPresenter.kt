package com.github.kimhyunjin.architecturepattern.mvp

import com.github.kimhyunjin.architecturepattern.mvp.model.ImageCountModel
import com.github.kimhyunjin.architecturepattern.mvp.repository.ImageRepository

/**
 * Presenter는 View를 참조, 여기서 View는 MvpActivity
 *
 * 데이터가 변경되면 인터페이스에 정의된 View의 함수 호출(변경 알려주기)
 *
 * Presenter의 경우, View와는 인터페이스를 통해 경계가 나뉘어있기 때문에 테스트 용이
 */
class MvpPresenter(
    private val model: ImageCountModel,
    private val imageRepository: ImageRepository
) : MvpContractor.Presenter, ImageRepository.Callback {

    private var view: MvpContractor.View? = null

    override fun attachView(view: MvpContractor.View) {
        this.view = view
    }

    override fun detachView() {
        this.view = null
    }

    override fun loadRandomImage() {
        imageRepository.getRandomImage(this)
    }

    override fun onLoadImage(url: String) {
        model.increase()
        view?.showImage(url)
        view?.showImageCountText(model.count)
    }
}