package com.github.kimhyunjin.architecturepattern.mvvm.bindingadapter

import android.widget.ImageView
import androidx.databinding.BindingAdapter
import coil.load
import com.github.kimhyunjin.architecturepattern.mvvm.model.Image

@BindingAdapter("image")
fun ImageView.setImage(image: Image?) {
    if (image == null) {
        return
    }

    load(image.url) {
        crossfade(300)
    }
}