package com.example.kidsdrawingapp.ui.canvas.tools

import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.example.kidsdrawingapp.R

@Composable
fun GalleryButton(
    onGalleryButtonClick: () -> Unit,
) {
    IconButton(
        onClick = {
            onGalleryButtonClick()
        }, modifier = Modifier
            .width(50.dp)
            .height(50.dp)
    ) {
        Icon(
            painter = painterResource(id = R.drawable.ic_gallery),
            contentDescription = "gallery",
            tint = Color.Unspecified
        )
    }
}