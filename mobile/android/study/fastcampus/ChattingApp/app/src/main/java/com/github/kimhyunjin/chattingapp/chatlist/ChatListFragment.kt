package com.github.kimhyunjin.chattingapp.chatlist

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.github.kimhyunjin.chattingapp.Key
import com.github.kimhyunjin.chattingapp.R
import com.github.kimhyunjin.chattingapp.chatdetail.ChatActivity
import com.github.kimhyunjin.chattingapp.databinding.FragmentUserlistBinding
import com.google.firebase.auth.ktx.auth
import com.google.firebase.database.DataSnapshot
import com.google.firebase.database.DatabaseError
import com.google.firebase.database.ValueEventListener
import com.google.firebase.database.ktx.database
import com.google.firebase.ktx.Firebase

class ChatListFragment : Fragment(R.layout.fragment_userlist) {

    private lateinit var binding: FragmentUserlistBinding

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentUserlistBinding.bind(view)

        val chatListAdapter = ChatListAdapter {
            val intent = Intent(context, ChatActivity::class.java)
            intent.putExtra(ChatActivity.EXTRA_CHAT_ROOM_ID, it.chatRoomId)
            intent.putExtra(ChatActivity.EXTRA_OTHER_USER_ID, it.otherUserId)
            startActivity(intent)
        }
        binding.userListRecyclerView.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = chatListAdapter
        }

        val currentUserId = Firebase.auth.currentUser?.uid ?: return
        val chatRoomDB = Firebase.database.reference.child(Key.DB_CHAT_ROOMS).child(currentUserId)

        chatRoomDB.addValueEventListener(object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val charRoomList = snapshot.children.map {
                    it.getValue(ChatRoomItem::class.java)
                }
                chatListAdapter.submitList(charRoomList)
            }

            override fun onCancelled(error: DatabaseError) {
                TODO("Not yet implemented")
            }

        })
    }
}