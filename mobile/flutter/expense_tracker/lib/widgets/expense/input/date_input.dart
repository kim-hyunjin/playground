part of 'package:expense_tracker/widgets/expense/input/input.dart';

final formatter = DateFormat.yMd();

class DateInput extends StatelessWidget {
  const DateInput({super.key, this.value, required this.onClick});

  final DateTime? value;
  final void Function() onClick;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text(value == null ? 'No date selected' : formatter.format(value!)),
          IconButton(
            onPressed: onClick,
            icon: const Icon(Icons.calendar_month),
          ),
        ],
      ),
    );
  }
}
