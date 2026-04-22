package com.github.kimhyunjin.architecturepattern.mvp.repository

/**
 * MVP에서 모델에 속하는 부분
 *
 * View와 Presenter에 대해서 알지 못한다.
 */
interface ImageRepository {

    fun getRandomImage(callback: Callback)

    interface Callback {
        fun onLoadImage(url: String)
    }
}