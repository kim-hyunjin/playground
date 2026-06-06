package com.github.kimhyunjin.mycontentprovider.room

import android.content.ContentValues
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "item")
data class Item(

    @PrimaryKey(autoGenerate = true)
    var itemId: Long = 0L,
    var title: String = "",
    var content: String = ""

) {

    companion object {

        fun fromContentValues(values: ContentValues?): Item {

            val item = Item()

            values?.let {

                if (values.containsKey("title")) item.title = values.getAsString("title")
                if (values.containsKey("content")) item.content = values.getAsString("content")
            }

            return item
        }
    }
}
