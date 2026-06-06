package com.github.kimhyunjin.architecturepattern.mvi.repository

import com.github.kimhyunjin.architecturepattern.mvi.model.Image

interface ImageRepository {
    suspend fun getRandomImage(): Image
}