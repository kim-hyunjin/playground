part of 'package:expense_tracker/widgets/expense/input/input.dart';

class AmountInput extends StatelessWidget {
  const AmountInput({super.key, required this.controller})
      : withExpanded = false;

  const AmountInput.withExpanded({super.key, required this.controller})
      : withExpanded = true;

  final TextEditingController controller;
  final bool withExpanded;

  @override
  Widget build(BuildContext context) {
    var input = TextField(
      controller: controller,
      keyboardType: TextInputType.number,
      decoration: const InputDecoration(
        prefixText: '\$ ',
        label: Text('Amount'),
      ),
    );

    if (withExpanded) {
      return Expanded(child: input);
    } else {
      return input;
    }
  }
}
