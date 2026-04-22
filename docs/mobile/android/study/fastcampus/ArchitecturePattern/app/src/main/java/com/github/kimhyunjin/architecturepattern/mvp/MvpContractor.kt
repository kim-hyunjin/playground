package com.github.kimhyunjin.architecturepattern.mvp

interface MvpContractor {

    interface View {
        fun showImage(url: String)

        fun showImageCountText(count: Int)
    }

    interface Presenter {

        fun attachView(view: View)

        fun detachView()

        fun loadRandomImage()
    }
}