part of 'package:todo_app/todos/todos.dart';

class CheckableTodoItem extends StatefulWidget {
  const CheckableTodoItem(this.text, this.priority, {super.key});

  final String text;
  final Priority priority;

  @override
  State<CheckableTodoItem> createState() => _CheckableTodoItemState();
}

// flutter는 widget의 위치가 바뀌면 기존 widget을 재사용하되 element에 연결된 'widget의 reference'만 바꿈
// state는 widget이 아닌 element에 연결됨
// TodoItem widget A <-- TodoItem element --> state A
// TodoItem widget B <-- TodoItem element --> state B
// TodoItem widget C <-- TodoItem element --> state C

// 여기서 key없이 widget의 위치를 바꾸면?
// widget C에 state A가 연결될 수 있음..
// TodoItem widget C <-- TodoItem element --> state A
// TodoItem widget B <-- TodoItem element --> state B
// TodoItem widget A <-- TodoItem element --> state C

// key와 함께라면?
// 같은 key의 widget의 위치가 바뀔 때 element 위치도 함께 바꿔줌
class _CheckableTodoItemState extends State<CheckableTodoItem> {
  var _done = false;

  void _setDone(bool? isChecked) {
    setState(() {
      _done = isChecked ?? false;
    });
  }

  @override
  Widget build(BuildContext context) {
    var icon = Icons.low_priority;

    if (widget.priority == Priority.urgent) {
      icon = Icons.notifications_active;
    }

    if (widget.priority == Priority.normal) {
      icon = Icons.list;
    }

    return Padding(
      padding: const EdgeInsets.all(8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Checkbox(value: _done, onChanged: _setDone),
          const SizedBox(width: 6),
          Icon(icon),
          const SizedBox(width: 12),
          Text(widget.text),
        ],
      ),
    );
  }
}
