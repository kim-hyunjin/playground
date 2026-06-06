package com.github.kimhyunjin.tomorrowhouse.bookmark

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.github.kimhyunjin.tomorrowhouse.R
import com.github.kimhyunjin.tomorrowhouse.data.ArticleItem
import com.github.kimhyunjin.tomorrowhouse.databinding.ItemArticleBinding

class BookmarkArticleAdapter(val onItemClicked: (ArticleItem) -> Unit) : ListAdapter<ArticleItem, BookmarkArticleAdapter.ViewHolder>(diffUtil) {
    inner class ViewHolder(private val binding: ItemArticleBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(articleItem: ArticleItem) {
            Glide.with(binding.thumbnailImageView).load(articleItem.imageUrl)
                .into(binding.thumbnailImageView)

            binding.root.setOnClickListener {
                onItemClicked(articleItem)
            }
            binding.descriptionTextView.text = articleItem.description
            changeBookmarkIcon(articleItem.isBookmark)
        }

        private fun changeBookmarkIcon(isBookmark: Boolean) {
            if (isBookmark) {
                binding.bookmarkImageButton.setBackgroundResource(R.drawable.baseline_bookmark_24)
            } else {
                binding.bookmarkImageButton.setBackgroundResource(R.drawable.baseline_bookmark_border_24)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(
            ItemArticleBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
            )
        )
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(currentList[position])
    }

    companion object {
        val diffUtil = object : DiffUtil.ItemCallback<ArticleItem>() {
            override fun areItemsTheSame(oldItem: ArticleItem, newItem: ArticleItem): Boolean {
                return oldItem.articleId == newItem.articleId
            }

            override fun areContentsTheSame(oldItem: ArticleItem, newItem: ArticleItem): Boolean {
                return oldItem == newItem
            }

        }
    }


}