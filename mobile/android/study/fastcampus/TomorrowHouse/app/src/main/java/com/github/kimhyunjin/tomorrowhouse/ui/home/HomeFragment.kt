package com.github.kimhyunjin.tomorrowhouse.ui.home

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.GridLayoutManager
import com.github.kimhyunjin.tomorrowhouse.R
import com.github.kimhyunjin.tomorrowhouse.data.ArticleItem
import com.github.kimhyunjin.tomorrowhouse.data.ArticleModel
import com.github.kimhyunjin.tomorrowhouse.databinding.FragmentHomeBinding
import com.google.android.material.snackbar.Snackbar
import com.google.firebase.Firebase
import com.google.firebase.auth.auth
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestoreException
import com.google.firebase.firestore.firestore
import com.google.firebase.firestore.toObject

class HomeFragment : Fragment(R.layout.fragment_home) {

    private lateinit var binding: FragmentHomeBinding
    private lateinit var articleAdapter: HomeArticleAdapter

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentHomeBinding.bind(view)
        setupWriteButton(view)
        setupBookmarkButton()
        setupRecyclerView()

        fetchFirestoreData()
    }

    private fun fetchFirestoreData() {
        val uid = Firebase.auth.currentUser?.uid ?: return
        Firebase.firestore.collection("bookmark").document(uid).get()
            .addOnSuccessListener { bookmark ->
                val bookmarkList = bookmark.get("articleIds") as? List<*>
                Firebase.firestore.collection("articles").get().addOnSuccessListener { result ->
                    val list = result
                        .map { snapshot ->
                            snapshot.toObject<ArticleModel>()
                        }.map { model ->
                            ArticleItem(
                                articleId = model.articleId,
                                description = model.description,
                                imageUrl = model.imageUrl,
                                isBookmark = bookmarkList?.contains(model.articleId) ?: false
                            )
                        }
                    articleAdapter.submitList(list)
                }

            }
            .addOnFailureListener {
            }
    }

    private fun setupRecyclerView() {
        articleAdapter = HomeArticleAdapter(
            onItemClicked = {
                it.articleId?.let { articleId ->
                    findNavController().navigate(
                        HomeFragmentDirections.actionHomeFragmentToArticleFragment(
                            articleId
                        )
                    )
                }
            },
            onBookmarkClicked = { articleId, isBookmark ->
                val uid = Firebase.auth.currentUser?.uid.orEmpty()
                Firebase.firestore.collection("bookmark").document(uid).update(
                    "articleIds",
                    if (isBookmark) {
                        FieldValue.arrayUnion(articleId)
                    } else {
                        FieldValue.arrayRemove(articleId)
                    }
                ).addOnFailureListener {
                    if ((it is FirebaseFirestoreException) && (it.code == FirebaseFirestoreException.Code.NOT_FOUND)) {
                        if (isBookmark) {
                            Firebase.firestore.collection("bookmark").document(uid)
                                .set(hashMapOf("articleIds" to listOf(articleId)))
                        }
                    }
                }
            }
        )

        binding.homeRecyclerView.apply {
            layoutManager = GridLayoutManager(context, 2)
            adapter = articleAdapter
        }
    }

    private fun setupBookmarkButton() {
        binding.bookmarkButton.setOnClickListener {
            findNavController().navigate(HomeFragmentDirections.actionHomeFragmentToBookmarkFragment())
        }
    }

    private fun setupWriteButton(view: View) {
        binding.writeButton.setOnClickListener {
            if (Firebase.auth.currentUser != null) {
                val action = HomeFragmentDirections.actionHomeFragmentToWriteArticleFragment()
                findNavController().navigate(action)
            } else {
                Snackbar.make(view, "로그인 후 사용해주세요.", Snackbar.LENGTH_SHORT).show()
            }
        }
    }
}