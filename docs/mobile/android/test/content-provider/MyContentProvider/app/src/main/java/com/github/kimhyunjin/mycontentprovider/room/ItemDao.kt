package com.github.kimhyunjin.mycontentprovider.room

import android.database.Cursor
import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update

@Dao
interface ItemDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insertItem(item: Item): Long

    @Update
    fun updateItem(item: Item): Int

    @Query("DELETE FROM item WHERE itemId = :id")
    fun deleteItem(id: Long): Int

    @Query("DELETE FROM item")
    fun deleteAll(): Int

    @Query("SELECT * FROM item WHERE itemId = :id")
    fun getItem(id: Long): Cursor

    @Query("SELECT * FROM item")
    fun getAllItem(): Cursor
}