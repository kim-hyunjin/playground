package com.github.kimhyunjin.mycontentprovider.provider

import android.annotation.SuppressLint
import android.content.ContentValues
import android.content.Context
import android.net.Uri
import android.util.Log
import com.github.kimhyunjin.mycontentprovider.db.PersonContract

class PersonResolveHelper(private var mContext: Context) {

    private var contentResolver = mContext.contentResolver

    private fun insertData() {
        var uri =
            Uri.parse("content://com.github.kimhyunjin.mycontentprovider.provider.PersonProvider/person")
        val values = ContentValues().apply {
            put(PersonContract.PersonEntry.PERSON_NAME, "ows")
            put(PersonContract.PersonEntry.PERSON_AGE, 28)
            put(PersonContract.PersonEntry.PERSON_MOBILE, "010-0000-0000")
        }

        uri = contentResolver.insert(uri, values)
        Log.i("insertData", "insertDatat 결과 : $uri")
    }

    @SuppressLint("Range")
    private fun queryData(): List<String> {
        val uri =
            Uri.parse("content://com.github.kimhyunjin.mycontentprovider.provider.PersonProvider/person")
        val columns = arrayOf(
            PersonContract.PersonEntry.PERSON_NAME,
            PersonContract.PersonEntry.PERSON_AGE,
            PersonContract.PersonEntry.PERSON_MOBILE
        )
        val cursor = contentResolver.query(uri, columns, null, null, "name ASC")
        Log.i("queryData", "queryData 결과 ${cursor?.count}")

        val list = ArrayList<String>()
        cursor?.let { cursor ->
            var index = 0
            while (cursor.moveToNext()) {
                val name = cursor.getString(cursor.getColumnIndex(columns.get(0)))
                val age = cursor.getInt(cursor.getColumnIndex(columns.get(1)))
                val mobile = cursor.getString(cursor.getColumnIndex(columns.get(2)))

                list.add("#${index} -> ${name}, ${age}, ${mobile}")
                index++
            }
        }
        return list
    }

    private fun updateDate() {
        val uri =
            Uri.parse("content://com.github.kimhyunjin.mycontentprovider.provider.PersonProvider/person")
        val selection = "mobile = ?"
        val selectionArgs = arrayOf("010-0000-0000")

        val values = ContentValues().apply {
            put("mobile", "010-1000-1000")
        }

        val count = contentResolver.update(uri, values, selection, selectionArgs)
        Log.i("updateDate", "updateData 결과 ${count}")
    }

    private fun deleteData() {
        val uri =
            Uri.parse("content://com.github.kimhyunjin.mycontentprovider.provider.PersonProvider/person")
        val selection = "name = ?"
        val selectionArgs = arrayOf("ows")

        val count = contentResolver.delete(uri, selection, selectionArgs)
        Log.i("deleteData", "deleteData 결과 ${count}")
    }
}