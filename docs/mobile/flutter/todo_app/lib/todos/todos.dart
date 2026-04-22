import 'package:flutter/material.dart';

part 'todo_item.dart';
part 'checkable_todo_item.dart';

enum Priority { urgent, normal, low }

class Todo {
  const Todo(this.text, this.priority);

  final String text;
  final Priority priority;
}

class Todos extends StatefulWidget {
  const Todos({super.key});

  @override
  State<StatefulWidget> createState() {
    return _TodosState();
  }
}

class _TodosState extends State<Todos> {
  var _order = 'asc';

  // dummy data
  final _todos = [
    const Todo(
      'Learn Flutter',
      Priority.urgent,
    ),
    const Todo(
      'Practice Flutter',
      Priority.normal,
    ),
    const Todo(
      'Explore other courses',
      Priority.low,
    ),
  ];

  List<Todo> get _orderedTodos {
    final sortedTodos = List.of(_todos);
    sortedTodos.sort((a, b) {
      final bComesAfterA = a.text.compareTo(b.text);
      return _order == 'asc' ? bComesAfterA : -bComesAfterA;
    });
    return sortedTodos;
  }

  void _changeOrder() {
    setState(() {
      _order = _order == 'asc' ? 'desc' : 'asc';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Align(
          alignment: Alignment.centerRight,
          child: TextButton.icon(
            onPressed: _changeOrder,
            icon: Icon(
              _order == 'asc' ? Icons.arrow_downward : Icons.arrow_upward,
            ),
            label: Text('Sort ${_order == 'asc' ? 'Descending' : 'Ascending'}'),
          ),
        ),
        Expanded(
          child: Column(
            children: [
              // for (final todo in _orderedTodos) TodoItem(todo.text, todo.priority),
              for (final todo in _orderedTodos)
                CheckableTodoItem(
                  todo.text,
                  todo.priority,
                  key: Key(todo
                      .text), // Key == ValueKey(more lightweight), ObjectKey
                ),
            ],
          ),
        ),
      ],
    );
  }
}
