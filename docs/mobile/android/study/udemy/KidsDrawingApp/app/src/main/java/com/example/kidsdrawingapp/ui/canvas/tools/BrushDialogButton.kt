package com.example.kidsdrawingapp.ui.canvas.tools

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.layout.wrapContentWidth
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import com.example.kidsdrawingapp.R

enum class BrushSize {
    SMALL,
    MEDIUM,
    BIG
}

@Composable
fun BrushDialogButton(onBrushSizeChange: (size: Float) -> Unit) {
    val showDialog = remember { mutableStateOf(false) }
    if (showDialog.value) {
        BrushDialog(onBrushSizeChange = onBrushSizeChange, onDismiss = { showDialog.value = false })
    }
    IconButton(
        onClick = { showDialog.value = true },
        modifier = Modifier
            .width(50.dp)
            .height(50.dp)
    ) {
        Icon(
            painter = painterResource(id = R.drawable.ic_brush),
            contentDescription = "brush",
            tint = Color.Unspecified
        )
    }

}

@Composable
fun BrushDialog(onBrushSizeChange: (size: Float) -> Unit, onDismiss: () -> Unit) {
    Dialog(onDismissRequest = onDismiss) {
        Surface(
            modifier = Modifier
                .wrapContentWidth()
                .wrapContentHeight(),
            shape = RoundedCornerShape(12.dp)
        ) {
            Column(
                modifier = Modifier
                    .wrapContentWidth()
                    .wrapContentHeight()
                    .padding(12.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                IconButton(onClick = {
                    onBrushSizeChange(10f)
                    onDismiss()
                }) {
                    BrushCircle(size = BrushSize.SMALL)
                }
                Spacer(modifier = Modifier.height(12.dp))
                IconButton(onClick = {
                    onBrushSizeChange(20f)
                    onDismiss()
                }) {
                    BrushCircle(size = BrushSize.MEDIUM)
                }
                Spacer(modifier = Modifier.height(12.dp))
                IconButton(onClick = {
                    onBrushSizeChange(30f)
                    onDismiss()
                }) {
                    BrushCircle(size = BrushSize.BIG)
                }
            }
        }
    }
}

@Composable
fun BrushCircle(size: BrushSize) {
    val sizeDp = when (size) {
        BrushSize.SMALL -> 10.dp
        BrushSize.MEDIUM -> 20.dp
        BrushSize.BIG -> 30.dp
    }
    Box(
        modifier = Modifier
            .size(sizeDp)
            .clip(CircleShape)
            .background(Color(0xFF666666))
    )
}