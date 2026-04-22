package com.example.kidsdrawingapp.ui.canvas.tools

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable

@Composable
fun Tools(
    onGalleryButtonClick: () -> Unit,
    onBrushSizeChange: (size: Float) -> Unit,
    onUndoButtonClick: () -> Unit,
    onRedoButtonClick: () -> Unit,
    onSaveButtonClick: () -> Unit
) {
    Row(
        horizontalArrangement = Arrangement.Center
    ) {
        GalleryButton(onGalleryButtonClick)
        BrushDialogButton(onBrushSizeChange)
        UndoButton(onUndoButtonClick)
        RedoButton(onRedoButtonClick)
        SaveButton(onSaveButtonClick)
    }
}