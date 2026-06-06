package com.github.kimhyunjin.mycontentprovider.provider

import android.content.ContentResolver
import android.content.ContentValues
import android.content.Context
import android.net.Uri
import android.os.Bundle
import android.util.Log
import com.github.kimhyunjin.mycontentprovider.room.Item

class MyContentResolveHelper(private val mContext: Context) {

    private var contentResolver: ContentResolver = mContext.contentResolver

    /**
     * select all items
     */
    fun getAllItems(): List<Item> {
        Log.i("getAllItems", "called!")

        val list = ArrayList<Item>()

        val cursor = contentResolver.query(MyContract.CONTENT_URI, null, null, null, null)

        Log.i("getAllItems", "cursor - ${cursor?.count}")

        if (cursor != null && cursor.count > 0) {

            while (cursor.moveToNext()) {

                val itemIdIndex = cursor.getColumnIndex("itemId")
                val titleIndex = cursor.getColumnIndex("title")
                val contentIndex = cursor.getColumnIndex("content")

                val id = cursor.getLong(itemIdIndex)
                val title = cursor.getString(titleIndex)
                val content = cursor.getString(contentIndex)

                val item = Item(id, title, content)
                list.add(item)

                Log.v(">>>", "@# id[$id] title[$title] content[$content]")
            }
        }

        return list
    }

    /**
     * select single item
     */
    fun getItem(id: Long): Item? {

        val cursor = contentResolver.query(MyContract.CONTENT_URI, null, "id", arrayOf("$id"), null)

        if (cursor != null && cursor.count > 0) {

            while (cursor.moveToNext()) {

                val itemIdIndex = cursor.getColumnIndex("itemId")
                val titleIndex = cursor.getColumnIndex("title")
                val contentIndex = cursor.getColumnIndex("content")

                val id = cursor.getLong(itemIdIndex)
                val title = cursor.getString(titleIndex)
                val content = cursor.getString(contentIndex)

                return Item(id, title, content)
            }
        }

        return null
    }

    /**
     * Insert
     */
    fun insertItem(title: String, content: String) {

        val contentValues = generateItem(title, content)
        contentResolver.insert(MyContract.CONTENT_URI, contentValues)
    }

    /**
     * Remove
     */
    fun removeItem(id: Long) {

        val uriString = "${MyContract.URI_STRING}/$id"

        contentResolver.delete(Uri.parse(uriString), "id", arrayOf("$id"))
    }

    /**
     * Item 생성 (ContentValues)
     */
    private fun generateItem(title: String, content: String): ContentValues {

        val values = ContentValues()
        values.put("title", title)
        values.put("content", content)

        return values
    }

    /**
     * 커스텀 메서드
     */
    fun customMethod(): String? {

        var value: String? = null

        val bundle: Bundle? = contentResolver.call(MyContract.CONTENT_URI, "hello", null, null)

        bundle?.let {

            val message = it.getString("message")
            Log.v(">>>", "customMethod : $message")
            value = message
        }

        return value
    }
}