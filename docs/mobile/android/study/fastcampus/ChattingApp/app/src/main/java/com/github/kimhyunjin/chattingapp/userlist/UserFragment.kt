package com.github.kimhyunjin.chattingapp.userlist

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.github.kimhyunjin.chattingapp.Key
import com.github.kimhyunjin.chattingapp.R
import com.github.kimhyunjin.chattingapp.chatdetail.ChatActivity
import com.github.kimhyunjin.chattingapp.chatlist.ChatRoomItem
import com.github.kimhyunjin.chattingapp.databinding.FragmentUserlistBinding
import com.google.firebase.auth.ktx.auth
import com.google.firebase.database.DataSnapshot
import com.google.firebase.database.DatabaseError
import com.google.firebase.database.DatabaseReference
import com.google.firebase.database.ValueEventListener
import com.google.firebase.database.ktx.database
import com.google.firebase.ktx.Firebase
import java.util.UUID

class UserFragment : Fragment(R.layout.fragment_userlist) {

    private lateinit var binding: FragmentUserlistBinding
    private lateinit var userListAdapter: UserAdapter

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentUserlistBinding.bind(view)

        userListAdapter = UserAdapter {
            handleUserClick(it)
        }
        binding.userListRecyclerView.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = userListAdapter
        }

        observeUserListChange()

    }

    private fun getChatRoomWithUserId(myUserId: String, otherUserId: String): DatabaseReference {
        return Firebase.database.reference.child(Key.DB_CHAT_ROOMS).child(myUserId)
            .child(otherUserId)
    }

    private fun handleUserClick(userItem: UserItem) {
        val myUserId = Firebase.auth.currentUser?.uid ?: return
        userItem.userId ?: return

        val chatRoomDB = getChatRoomWithUserId(myUserId, userItem.userId)

        chatRoomDB.get().addOnSuccessListener {
            var chatRoomId = ""
            if (it.exists()) {
                val chatRoom = it.getValue(ChatRoomItem::class.java)
                chatRoomId = chatRoom?.chatRoomId ?: ""
            } else {
                chatRoomId = UUID.randomUUID().toString()
                val newChatRoom = ChatRoomItem(
                    chatRoomId = chatRoomId,
                    otherUserId = userItem.userId,
                    otherUserName = userItem.username
                )
                chatRoomDB.setValue(newChatRoom)
            }

            val intent = Intent(context, ChatActivity::class.java)
            intent.putExtra(ChatActivity.EXTRA_CHAT_ROOM_ID, chatRoomId)
            intent.putExtra(ChatActivity.EXTRA_OTHER_USER_ID, userItem.userId)
            startActivity(intent)
        }
    }

    private fun observeUserListChange() {
        Firebase.database.reference.child(Key.DB_USERS)
            .addListenerForSingleValueEvent(object : ValueEventListener {
                override fun onDataChange(snapshot: DataSnapshot) {
                    val list = mutableListOf<UserItem>()

                    snapshot.children.forEach {
                        val user = it.getValue(UserItem::class.java)
                        if (user != null && user.userId != Firebase.auth.currentUser?.uid) {
                            list.add(user)
                        }
                    }

                    Log.i("USERS - from firebase", list.toString())

                    userListAdapter.submitList(list)
                    userListAdapter.notifyItemInserted(list.lastIndex)
                }

                override fun onCancelled(error: DatabaseError) {
                    TODO("Not yet implemented")
                }

            })
    }
}