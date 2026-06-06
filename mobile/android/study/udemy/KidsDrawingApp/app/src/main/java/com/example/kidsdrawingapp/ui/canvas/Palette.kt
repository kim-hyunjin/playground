package com.example.kidsdrawingapp.ui.canvas

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.IconButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun Palette(onChangeColor: (color: Color) -> Unit) {
    val currentColor = remember { mutableStateOf(Color.Black) }

    val colorButtonClickHandler: (Color) -> Unit = {
        currentColor.value = it
        onChangeColor(it)
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .border(2.dp, Color(0xFF999999), RoundedCornerShape(10.dp)),
        horizontalArrangement = Arrangement.Center
    ) {
        ColorButton(color = Color.Black, isActive = Color.Black == currentColor.value, onClick = {
            colorButtonClickHandler(Color.Black)
        })
        ColorButton(color = Color.Red, isActive = Color.Red == currentColor.value, onClick = {
            colorButtonClickHandler(Color.Red)
        })
        ColorButton(color = Color.Blue, isActive = Color.Blue == currentColor.value, onClick = {
            colorButtonClickHandler(Color.Blue)
        })
        ColorButton(color = Color.Yellow, isActive = Color.Yellow == currentColor.value, onClick = {
            colorButtonClickHandler(Color.Yellow)
        })
        ColorButton(color = Color.Green, isActive = Color.Green == currentColor.value, onClick = {
            colorButtonClickHandler(Color.Green)
        })
        ColorButton(
            color = Color.Magenta,
            isActive = Color.Magenta == currentColor.value,
            onClick = {
                colorButtonClickHandler(Color.Magenta)
            })
    }
}

@Composable
fun ColorButton(color: Color, isActive: Boolean, onClick: () -> Unit) {
    IconButton(
        onClick = onClick
    ) {
        if (isActive) {
            Box(
                modifier = Modifier
                    .size(15.dp)
                    .clip(CircleShape)
                    .background(color)
                    .border(2.dp, Color.Gray, CircleShape)
            )
        } else {
            Box(
                modifier = Modifier
                    .size(15.dp)
                    .clip(CircleShape)
                    .background(color)
            )
        }
    }
}