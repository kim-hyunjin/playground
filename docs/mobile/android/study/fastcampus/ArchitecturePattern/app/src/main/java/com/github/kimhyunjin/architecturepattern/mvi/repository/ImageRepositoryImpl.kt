package com.github.kimhyunjin.architecturepattern.mvi.repository

import com.github.kimhyunjin.architecturepattern.RetrofitManager
import com.github.kimhyunjin.architecturepattern.mvi.model.Image
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class ImageRepositoryImpl(private val dispatcher: CoroutineDispatcher = Dispatchers.IO): ImageRepository {
    override suspend fun getRandomImage(): Image {
        return withContext(dispatcher) {
            RetrofitManager.imageService.getRandomImageSuspend().let {
                Image(it.random().url)
            }
        }
    }
}