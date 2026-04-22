import 'package:chat_app/models/user.dart' as model;
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class UserProvider {
  static model.User? _currentUser;

  static Future<model.User> get currentUser async {
    if (_currentUser == null) {
      final user = FirebaseAuth.instance.currentUser!;
      final userData = await FirebaseFirestore.instance
          .collection('users')
          .doc(user.uid)
          .get();

      _currentUser = model.User(
          id: user.uid,
          username: userData.data()!['username'],
          email: user.email!,
          imageUrl: userData.data()!['image_url']);
    }

    return _currentUser!;
  }

  static void clear() {
    _currentUser = null;
  }
}
