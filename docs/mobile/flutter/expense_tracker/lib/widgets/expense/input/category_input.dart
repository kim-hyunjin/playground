part of 'package:expense_tracker/widgets/expense/input/input.dart';

class CategoryInput extends StatelessWidget {
  const CategoryInput({super.key, required this.value, required this.onChange});

  final Category value;
  final void Function(Category?) onChange;

  @override
  Widget build(BuildContext context) {
    return DropdownButton(
      value: value,
      items: Category.values
          .map((category) => DropdownMenuItem(
                value: category,
                child: Text(
                  category.name.toUpperCase(),
                ),
              ))
          .toList(),
      onChanged: onChange,
    );
  }
}
