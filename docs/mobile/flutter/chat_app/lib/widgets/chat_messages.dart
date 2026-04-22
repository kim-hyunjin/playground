import 'package:chat_app/widgets/message_bubble.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class ChatMessages extends StatelessWidget {
  const ChatMessages({super.key});

  @override
  Widget build(BuildContext context) {
    final authenticatedUser = FirebaseAuth.instance.currentUser;
    return StreamBuilder(
        stream: FirebaseFirestore.instance
            .collection('chat')
            .orderBy('createdAt', descending: true)
            .snapshots(),
        builder: (ctx, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }

          if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
            return const Center(
              child: Text('No messages found.'),
            );
          }

          if (snapshot.hasError) {
            return const Center(
              child: Text('Something went wrong...'),
            );
          }

          final loadedMsg = snapshot.data!.docs;

          return ListView.builder(
            padding: const EdgeInsets.only(
              bottom: 40,
              left: 13,
              right: 13,
            ),
            reverse: true,
            itemCount: loadedMsg.length,
            itemBuilder: (ctx, index) {
              final chatMsg = loadedMsg[index].data();
              final nextChatMsg = index + 1 < loadedMsg.length
                  ? loadedMsg[index + 1].data()
                  : null;

              final curMsgUserId = chatMsg['userId'];
              final nextMsgUserId = nextChatMsg?['userId'];
              final nextUserIsSame = curMsgUserId == nextMsgUserId;

              if (nextUserIsSame) {
                return MessageBubble.next(
                    message: chatMsg['text'],
                    isMe: curMsgUserId == authenticatedUser!.uid);
              } else {
                return MessageBubble.first(
                    username: chatMsg['username'],
                    userImage: chatMsg['userImage'],
                    message: chatMsg['text'],
                    isMe: curMsgUserId == authenticatedUser!.uid);
              }
            },
          );
        });
  }
}
