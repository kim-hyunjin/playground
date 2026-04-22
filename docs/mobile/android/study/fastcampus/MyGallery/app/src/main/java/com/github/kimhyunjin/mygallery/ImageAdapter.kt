package com.github.kimhyunjin.mygallery

import android.content.Context
import android.net.Uri
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.github.kimhyunjin.mygallery.databinding.ItemImageBinding
import com.github.kimhyunjin.mygallery.databinding.ItemLoadmoreBinding

sealed class ImageItems {
    data class Image(val uri: Uri) : ImageItems()
    data object LoadMore : ImageItems()
}

class ImageAdapter(private val itemClickListener: ItemClickListener) :
    ListAdapter<ImageItems, RecyclerView.ViewHolder>(object : DiffUtil.ItemCallback<ImageItems>() {
        override fun areItemsTheSame(oldItem: ImageItems, newItem: ImageItems): Boolean {
            return oldItem === newItem // 같은 레퍼런스를 참조하고 있는지 체크
        }

        override fun areContentsTheSame(oldItem: ImageItems, newItem: ImageItems): Boolean {
            return oldItem == newItem
        }

    }) {

    override fun getItemCount(): Int {
        val originSize = currentList.count()
        return if (originSize == 0) 0 else originSize.inc()
    }

    override fun getItemViewType(position: Int): Int {
        return if (itemCount.dec() == position) ITEM_LOADMORE else ITEM_IMAGE
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        val inflater =
            parent.context.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        return when (viewType) {
            ITEM_IMAGE -> {
                val binding = ItemImageBinding.inflate(inflater, parent, false)
                ImageViewHolder(binding)
            }

            else -> {
                val binding = ItemLoadmoreBinding.inflate(inflater, parent, false)
                LoadmoreViewHolder(binding)
            }
        }
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        when (holder) {
            is ImageViewHolder -> {
                holder.bind(currentList[position] as ImageItems.Image)
            }

            is LoadmoreViewHolder -> {
                holder.bind(itemClickListener)
            }
        }
    }

    companion object {
        const val ITEM_IMAGE = 0
        const val ITEM_LOADMORE = 1
    }

    interface ItemClickListener {
        fun onClickLoadmore()
    }

}

class ImageViewHolder(private val binding: ItemImageBinding) :
    RecyclerView.ViewHolder(binding.root) {
    fun bind(item: ImageItems.Image) {
        binding.ivPreview.setImageURI(item.uri)
    }
}

class LoadmoreViewHolder(private val binding: ItemLoadmoreBinding) :
    RecyclerView.ViewHolder(binding.root) {
    fun bind(itemClickListener: ImageAdapter.ItemClickListener) {
        binding.tvLoadMore.setOnClickListener {
            itemClickListener.onClickLoadmore()
        }
    }
}