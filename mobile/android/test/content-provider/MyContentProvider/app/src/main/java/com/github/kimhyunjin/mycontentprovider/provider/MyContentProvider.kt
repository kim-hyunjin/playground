package com.github.kimhyunjin.mycontentprovider.provider

import android.content.ContentProvider
import android.content.ContentUris
import android.content.ContentValues
import android.database.Cursor
import android.net.Uri
import android.os.Bundle
import com.github.kimhyunjin.mycontentprovider.room.Item
import com.github.kimhyunjin.mycontentprovider.room.ItemDatabase

class MyContentProvider : ContentProvider() {
    private lateinit var db: ItemDatabase
    override fun onCreate(): Boolean {
        context?.let {
            db = ItemDatabase.getInstance(it)
        }
        return true
    }

    override fun query(
        uri: Uri,
        projection: Array<out String>?,
        selection: String?,
        selectionArgs: Array<out String>?,
        sortOrder: String?
    ): Cursor? {
        context?.let {

            val cursor = db.itemDao().getAllItem()
            cursor.setNotificationUri(it.contentResolver, uri)
            return cursor
        }

        throw IllegalArgumentException("Failed to query row for uri $uri")
    }

    override fun getType(uri: Uri): String? {
        return "${MyContract.AUTHORITY}.${MyContract.TABLE_NAME}"
    }

    override fun insert(uri: Uri, values: ContentValues?): Uri? {
        context?.let {

            val id = db.itemDao().insertItem(Item.fromContentValues(values))
            if (id != -1L) {

                it.contentResolver.notifyChange(uri, null)
                return ContentUris.withAppendedId(uri, id)
            }
        }

        throw IllegalArgumentException("Failed to insert row into $uri")
    }

    override fun delete(uri: Uri, selection: String?, selectionArgs: Array<out String>?): Int {

        context?.let {

            val count = db.itemDao().deleteItem(ContentUris.parseId(uri))
            it.contentResolver.notifyChange(uri, null)
            return count
        }

        throw IllegalArgumentException("Failed to delete row into $uri")
    }

    override fun update(
        uri: Uri,
        values: ContentValues?,
        selection: String?,
        selectionArgs: Array<out String>?
    ): Int {

        context?.let {

            val count = db.itemDao().updateItem(Item.fromContentValues(values))
            it.contentResolver.notifyChange(uri, null)
            return count
        }

        throw IllegalArgumentException("Failed to update row into $uri")
    }

    /**
     * Custom Method
     */
    override fun call(method: String, arg: String?, extras: Bundle?): Bundle? {

        val bundle = Bundle()

        if (method == "hello") {

            bundle.putString("message", "Hello from content provider!")

            return bundle
        }

        return null
    }
}