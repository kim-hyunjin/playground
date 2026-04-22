package com.github.kimhyunjin.tomorrowhouse.bookmark

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.View
import androidx.navigation.fragment.findNavController
import androidx.navigation.ui.setupWithNavController
import androidx.recyclerview.widget.GridLayoutManager
import com.github.kimhyunjin.tomorrowhouse.R
import com.github.kimhyunjin.tomorrowhouse.data.ArticleItem
import com.github.kimhyunjin.tomorrowhouse.data.ArticleModel
import com.github.kimhyunjin.tomorrowhouse.databinding.FragmentBookmarkBinding
import com.google.firebase.Firebase
import com.google.firebase.auth.auth
import com.google.firebase.firestore.firestore
import com.google.firebase.firestore.toObject


class BookmarkFragment : Fragment(R.layout.fragment_bookmark) {

    private lateinit var binding: FragmentBookmarkBinding
    private lateinit var bookmarkAdapter: BookmarkArticleAdapter

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentBookmarkBinding.bind(view)

        binding.toolbar.setupWithNavController(findNavController())

        bookmarkAdapter = BookmarkArticleAdapter {
            it.articleId?.let { articleId ->
                findNavController().navigate(
                    BookmarkFragmentDirections.actionBookmarkFragmentToArticleFragment(
                        articleId
                    )
                )
            }
        }
        binding.articleRecyclerView.apply {
            layoutManager = GridLayoutManager(context, 2)
            adapter = bookmarkAdapter
        }

        val uid = Firebase.auth.currentUser?.uid.orEmpty()
        Firebase.firestore.collection("bookmark").document(uid).get().addOnSuccessListener {
            val list = it.get("articleIds") as? List<*>
            if (list != null) {
                if (list.isNotEmpty()) {
                    Firebase.firestore.collection("articles").whereIn("articleId", list).get()
                        .addOnSuccessListener { result ->
                            bookmarkAdapter.submitList(result.map { article -> article.toObject<ArticleModel>() }
                                .map { model ->
                                    ArticleItem(
                                        articleId = model.articleId,
                                        description = model.description,
                                        imageUrl = model.imageUrl,
                                        isBookmark = true
                                    )
                                })
                        }.addOnFailureListener { e ->
                            e.printStackTrace()
                        }
                }
            }
        }.addOnFailureListener { e ->
            e.printStackTrace()
        }
    }
}