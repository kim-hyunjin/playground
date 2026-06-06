package com.github.kimhyunjin.mygallery

import android.content.Context
import android.net.Uri
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.github.kimhyunjin.mygallery.databinding.ItemAlbumBinding

data class AlbumItem(val uri: Uri)
class AlbumAdapter(private val list: List<AlbumItem>): RecyclerView.Adapter<AlbumAdapter.ViewHolder>() {

    class ViewHolder(private val binding: ItemAlbumBinding): RecyclerView.ViewHolder(binding.root) {
        fun bind(item: AlbumItem) {
            binding.ivAlbum.setImageURI(item.uri)
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val inflater = parent.context.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        return AlbumAdapter.ViewHolder(ItemAlbumBinding.inflate(inflater, parent, false))
    }

    override fun getItemCount(): Int {
        return list.size
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(list[position])
    }
}