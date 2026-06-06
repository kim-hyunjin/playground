package com.github.kimhyunjin.architecturepattern.mvvm.repository

import com.github.kimhyunjin.architecturepattern.RetrofitManager
import com.github.kimhyunjin.architecturepattern.mvvm.model.Image
import io.reactivex.Single
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.schedulers.Schedulers

class ImageRepositoryImpl : ImageRepository {
    override fun getRandomImage(): Single<Image> {
        return RetrofitManager.imageService.getRandomImageRx()
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .flatMap { item ->
                Single.just(Image(item.random().url))
            }
    }
}