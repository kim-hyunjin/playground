package com.github.kimhyunjin.walletcards

import java.util.Date

data class DetailItem(
    val id : Long,
    val date : Date,
    val content : String,
    val amount : Long,
    val type : Type
)

enum class Type {
    CANCEL, PAY, POINT
}