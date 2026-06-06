part of 'package:expense_tracker/widgets/expense/input/input.dart';

class TitleInput extends StatelessWidget {
  const TitleInput({super.key, required this.controller})
      : withExpanded = false;

  const TitleInput.withExpanded({super.key, required this.controller})
      : withExpanded = true;

  final TextEditingController controller;
  final bool withExpanded;

  @override
  Widget build(BuildContext context) {
    var input = TextField(
      controller: controller,
      maxLength: 50,
      decoration: const InputDecoration(
        label: Text('Title'),
      ),
    );

    if (withExpanded) {
      return Expanded(child: input);
    } else {
      return input;
    }
  }
}
