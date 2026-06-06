package com.github.kimhyunjin.contentresolverexam

import android.net.Uri

object MyContract {

    const val TABLE_NAME = "item"
    const val AUTHORITY = "com.github.kimhyunjin.mycontentprovider.provider.MyContentProvider"
    const val URI_STRING = "content://$AUTHORITY/$TABLE_NAME"
    val CONTENT_URI: Uri = Uri.parse(URI_STRING)
}