import 'package:flutter/material.dart';
import 'package:todo_app/todos/todos.dart';

import 'package:todo_app/ui_updates_demo.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(useMaterial3: true),
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Flutter Internals'),
        ),
        body: const Todos(),
      ),
    );
  }
}
