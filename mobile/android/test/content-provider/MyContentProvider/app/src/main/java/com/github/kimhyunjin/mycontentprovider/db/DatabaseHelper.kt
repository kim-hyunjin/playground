package com.github.kimhyunjin.mycontentprovider.db

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import android.provider.BaseColumns
import com.github.kimhyunjin.mycontentprovider.db.PersonContract.PersonEntry.PERSON_AGE
import com.github.kimhyunjin.mycontentprovider.db.PersonContract.PersonEntry.PERSON_MOBILE
import com.github.kimhyunjin.mycontentprovider.db.PersonContract.PersonEntry.PERSON_NAME
import com.github.kimhyunjin.mycontentprovider.db.PersonContract.PersonEntry.TABLE_NAME

class DatabaseHelper private constructor(context: Context) :
    SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    override fun onCreate(db: SQLiteDatabase?) {
        db?.execSQL(CREATE_TABLE)
    }

    override fun onUpgrade(db: SQLiteDatabase?, p1: Int, p2: Int) {
        db?.execSQL("DROP TABLE IF EXISTS $TABLE_NAME")
        onCreate(db)
    }

    companion object {
        const val DATABASE_NAME = "person.db"
        const val DATABASE_VERSION = 2
        var instance: DatabaseHelper? = null

        val ALL_COLUMNS = arrayOf(BaseColumns._ID, PERSON_NAME, PERSON_AGE, PERSON_MOBILE)
        val CREATE_TABLE =
            "CREATE TABLE $TABLE_NAME (${BaseColumns._ID} INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "$PERSON_NAME TEXT, $PERSON_AGE INTEGER, $PERSON_MOBILE TEXT)"

        fun getInstance(context: Context): DatabaseHelper =
            if (instance == null) DatabaseHelper(context.applicationContext) else instance!!
    }
}