import 'package:chat_app/providers/user_provider.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

class NewMessage extends StatefulWidget {
  const NewMessage({super.key});

  @override
  State<NewMessage> createState() {
    return _NewMessageState();
  }
}

class _NewMessageState extends State<NewMessage> {
  final _newMessageController = TextEditingController();

  @override
  void dispose() {
    _newMessageController.dispose();
    super.dispose();
  }

  void _submitMessage() async {
    final enteredMsg = _newMessageController.text;

    if (enteredMsg.trim().isEmpty) return;

    FocusScope.of(context).unfocus();
    _newMessageController.clear();

    final user = await UserProvider.currentUser;
    FirebaseFirestore.instance.collection('chat').add({
      'text': enteredMsg,
      'createdAt': Timestamp.now(),
      'userId': user.id,
      'username': user.username,
      'userImage': user.imageUrl,
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 15, right: 1, bottom: 14),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _newMessageController,
              textCapitalization: TextCapitalization.sentences,
              autocorrect: true,
              enableSuggestions: true,
              decoration: const InputDecoration(labelText: 'Send a message..'),
            ),
          ),
          IconButton(
            onPressed: _submitMessage,
            icon: const Icon(Icons.send),
            color: Theme.of(context).colorScheme.primary,
          ),
        ],
      ),
    );
  }
}
