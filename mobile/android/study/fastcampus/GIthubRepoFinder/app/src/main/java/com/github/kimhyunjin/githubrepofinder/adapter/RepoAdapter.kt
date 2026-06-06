package com.github.kimhyunjin.githubrepofinder.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.github.kimhyunjin.githubrepofinder.databinding.ItemRepoBinding
import com.github.kimhyunjin.githubrepofinder.model.Repo

class RepoAdapter(val onClick: (Repo) -> Unit) : ListAdapter<Repo, RepoAdapter.ViewHolder>(RepoAdapter.diffUtil) {

    inner class ViewHolder(private val binding: ItemRepoBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(item: Repo) {
            binding.repoNameTextView.text = item.name
            binding.descriptionTextView.text = item.description
            binding.starCountTextView.text = "${item.starCount}"
            binding.forkCountTextView.text = "${item.forkCount}"

            binding.root.setOnClickListener {
                onClick(item)
            }
        }
    }

    companion object {
        val diffUtil = object : DiffUtil.ItemCallback<Repo>() {
            override fun areItemsTheSame(oldItem: Repo, newItem: Repo): Boolean {
                return oldItem.id == newItem.id
            }

            override fun areContentsTheSame(oldItem: Repo, newItem: Repo): Boolean {
                return oldItem == newItem
            }

        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(
            ItemRepoBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
            )
        )
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(currentList[position])
    }
}