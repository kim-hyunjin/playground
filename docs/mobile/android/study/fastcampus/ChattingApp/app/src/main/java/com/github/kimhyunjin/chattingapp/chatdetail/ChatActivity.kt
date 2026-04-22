package com.github.kimhyunjin.chattingapp.chatdetail

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.github.kimhyunjin.chattingapp.Key
import com.github.kimhyunjin.chattingapp.R
import com.github.kimhyunjin.chattingapp.databinding.ActivityChatBinding
import com.github.kimhyunjin.chattingapp.userlist.UserItem
import com.google.firebase.auth.ktx.auth
import com.google.firebase.database.ChildEventListener
import com.google.firebase.database.DataSnapshot
import com.google.firebase.database.DatabaseError
import com.google.firebase.database.ktx.database
import com.google.firebase.ktx.Firebase
import okhttp3.Call
import okhttp3.Callback
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import org.json.JSONObject
import java.io.IOException

class ChatActivity : AppCompatActivity() {

    private lateinit var binding: ActivityChatBinding
    private var chatRoomId = ""
    private var otherUserId = ""
    private var otherUserFcmToken = ""
    private var myUserId = ""
    private var myUsername = ""

    private val chatItemList = mutableListOf<ChatItem>()

    private lateinit var chatAdapter: ChatAdapter
    private lateinit var linearLayoutManager: LinearLayoutManager
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityChatBinding.inflate(layoutInflater)
        setContentView(binding.root)

        chatRoomId = intent.getStringExtra(EXTRA_CHAT_ROOM_ID) ?: return
        otherUserId = intent.getStringExtra(EXTRA_OTHER_USER_ID) ?: return
        myUserId = Firebase.auth.currentUser?.uid ?: ""

        chatAdapter = ChatAdapter()
        linearLayoutManager = LinearLayoutManager(this)
        binding.chatRecyclerView.apply {
            layoutManager = linearLayoutManager
            adapter = chatAdapter
        }

        chatAdapter.registerAdapterDataObserver(object : RecyclerView.AdapterDataObserver() {
            override fun onItemRangeInserted(positionStart: Int, itemCount: Int) {
                super.onItemRangeInserted(positionStart, itemCount)

                linearLayoutManager.smoothScrollToPosition(
                    binding.chatRecyclerView,
                    null,
                    chatAdapter.itemCount
                )
            }
        })

        getUserItemWithId(myUserId) {
            myUsername = it.username ?: ""
        }
        getUserItemWithId(otherUserId) { otherUserItem ->
            chatAdapter.otherUserItem = otherUserItem
            otherUserFcmToken = otherUserItem.fcmToken ?: ""
        }
        observeChatAdded()

        binding.sendButton.setOnClickListener {
            val message = binding.messageEditText.text.toString()
            if (message.isEmpty()) {
                return@setOnClickListener
            }

            sendMessage(message)

            binding.messageEditText.text.clear()
        }
    }

    private fun getUserItemWithId(id: String, onSuccess: (userItem: UserItem) -> Unit) {
        Firebase.database.reference.child(Key.DB_USERS).child(id).get().addOnSuccessListener {
            val userItem = it.getValue(UserItem::class.java)
            if (userItem != null) {
                onSuccess(userItem)
            }
        }
    }

    private fun observeChatAdded() {
        Firebase.database.reference.child(Key.DB_CHATS).child(chatRoomId)
            .addChildEventListener(object : ChildEventListener {
                override fun onChildAdded(snapshot: DataSnapshot, previousChildName: String?) {
                    val chatItem = snapshot.getValue(ChatItem::class.java)
                    chatItem ?: return
                    chatItemList.add(chatItem)
                    chatAdapter.submitList(chatItemList)
                    chatAdapter.notifyItemInserted(chatItemList.lastIndex)
                }

                override fun onChildChanged(snapshot: DataSnapshot, previousChildName: String?) {
                    TODO("Not yet implemented")
                }

                override fun onChildRemoved(snapshot: DataSnapshot) {
                    TODO("Not yet implemented")
                }

                override fun onChildMoved(snapshot: DataSnapshot, previousChildName: String?) {
                    TODO("Not yet implemented")
                }

                override fun onCancelled(error: DatabaseError) {
                    TODO("Not yet implemented")
                }

            })
    }

    private fun sendMessage(message: String) {
        Firebase.database.reference.child(Key.DB_CHATS).child(chatRoomId).push().apply {
            val chatItem = ChatItem(
                message = message,
                userId = myUserId,
                chatId = key
            )
            setValue(chatItem)
        }

        val updates = hashMapOf<String, Any>(
            "${Key.DB_CHAT_ROOMS}/$myUserId/$otherUserId/lastMessage" to message,
            "${Key.DB_CHAT_ROOMS}/$otherUserId/$myUserId/lastMessage" to message,
            "${Key.DB_CHAT_ROOMS}/$otherUserId/$myUserId/chatRoomId" to chatRoomId,
            "${Key.DB_CHAT_ROOMS}/$otherUserId/$myUserId/otherUserId" to myUserId,
            "${Key.DB_CHAT_ROOMS}/$otherUserId/$myUserId/otherUserName" to myUsername,
        )
        Firebase.database.reference.updateChildren(updates)

        sendNotification(message)
    }

    private fun sendNotification(message: String) {
        val client = OkHttpClient()

        val root = JSONObject()
        val notification = JSONObject()
        notification.put("title", myUsername)
        notification.put("body", message)
        root.put("to", otherUserFcmToken)
        root.put("priority", "high")
        root.put("notification", notification)

        val body = root.toString().toRequestBody("application/json; charset=utf-8".toMediaType())
        val request = Request.Builder().url("https://fcm.googleapis.com/fcm/send").post(body)
            .header("Authorization", "key=${getString(R.string.fcm_server_key)}").build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e("notification send", e.toString())
            }

            override fun onResponse(call: Call, response: Response) {
                Log.i("notification send", response.toString())
            }

        })
    }

    companion object {
        const val EXTRA_CHAT_ROOM_ID = "chatRoomId"
        const val EXTRA_OTHER_USER_ID = "otherUserId"
    }
}