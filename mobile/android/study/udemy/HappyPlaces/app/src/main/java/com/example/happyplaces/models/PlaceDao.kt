package com.example.happyplaces.models

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface PlaceDao {

    @Insert
    suspend fun insert(entity: PlaceEntity)

    @Query("Select * from `place`")
    fun fetchAllPlace(): Flow<List<PlaceEntity>>

    @Delete
    fun delete(entity: PlaceEntity)
}