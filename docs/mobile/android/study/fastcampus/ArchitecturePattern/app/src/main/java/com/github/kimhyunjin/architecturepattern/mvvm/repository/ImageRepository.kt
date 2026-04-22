package com.github.kimhyunjin.architecturepattern.mvvm.repository

import com.github.kimhyunjin.architecturepattern.mvvm.model.Image
import io.reactivex.Single

interface ImageRepository {

    fun getRandomImage(): Single<Image>
}