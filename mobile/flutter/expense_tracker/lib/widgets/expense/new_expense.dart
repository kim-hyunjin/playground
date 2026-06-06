import 'dart:io';

import 'package:expense_tracker/widgets/expense/input/input.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'package:expense_tracker/models/expense.dart';

class NewExpense extends StatefulWidget {
  const NewExpense({super.key, required this.onAddExpense});

  final void Function(Expense expense) onAddExpense;

  @override
  State<NewExpense> createState() {
    return _NewExpenseState();
  }
}

class _NewExpenseState extends State<NewExpense> {
  final _titleController = TextEditingController();
  final _amountController = TextEditingController();
  DateTime? _selectedDate;
  Category _selectedCategory = Category.food;

  void _presentDatePicker() async {
    final now = DateTime.now();
    final firstDate = DateTime(now.year - 1, now.month, now.day);
    final pickedDate = await showDatePicker(
      context: context,
      initialDate: now,
      firstDate: firstDate,
      lastDate: now,
    );

    setState(() {
      _selectedDate = pickedDate;
    });
  }

  void _showDialog() {
    const title = Text('Invalid input');
    const content = Text(
        'Please make sure a valid title, amount, date and category was entered.');

    if (Platform.isIOS) {
      showCupertinoDialog(
        context: context,
        builder: (ctx) => CupertinoAlertDialog(
          title: title,
          content: content,
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(ctx);
              },
              child: const Text('Okay'),
            ),
          ],
        ),
      );
    } else if (Platform.isAndroid) {
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          title: title,
          content: content,
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(ctx);
              },
              child: const Text('Okay'),
            ),
          ],
        ),
      );
    }
  }

  void _submitExpenseData() {
    final enteredAmount = double.tryParse(_amountController.text);
    final amountIsInvalid = enteredAmount == null || enteredAmount <= 0;
    if (_titleController.text.trim().isEmpty ||
        amountIsInvalid ||
        _selectedDate == null) {
      _showDialog();
      return;
    }

    widget.onAddExpense(Expense(
      title: _titleController.text,
      amount: enteredAmount,
      date: _selectedDate!,
      category: _selectedCategory,
    ));

    Navigator.pop(context);
  }

  void _handleCategoryChange(Category? category) {
    if (category == null) {
      return;
    }
    setState(() {
      _selectedCategory = category;
    });
  }

  @override
  void dispose() {
    _titleController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final keyboardSpace = MediaQuery.of(context).viewInsets.bottom;

    final horizontalLayout = Column(
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TitleInput.withExpanded(controller: _titleController),
            AmountInput.withExpanded(controller: _amountController),
          ],
        ),
        Row(
          children: [
            CategoryInput(
                value: _selectedCategory, onChange: _handleCategoryChange),
            DateInput(
              onClick: _presentDatePicker,
              value: _selectedDate,
            ),
          ],
        ),
        const SizedBox(
          height: 16,
        ),
        Row(
          children: [
            const Spacer(),
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: _submitExpenseData,
              child: const Text('Save Expense'),
            )
          ],
        ),
      ],
    );

    final verticalLayout = Column(
      children: [
        TitleInput(controller: _titleController),
        Row(
          children: [
            AmountInput.withExpanded(controller: _amountController),
            const SizedBox(
              width: 16,
            ),
            DateInput(
              onClick: _presentDatePicker,
              value: _selectedDate,
            ),
          ],
        ),
        const SizedBox(
          height: 16,
        ),
        Row(
          children: [
            CategoryInput(
                value: _selectedCategory, onChange: _handleCategoryChange),
            const Spacer(),
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: _submitExpenseData,
              child: const Text('Save Expense'),
            )
          ],
        ),
      ],
    );

    return LayoutBuilder(
      builder: (ctx, constraints) {
        final width = constraints.maxWidth;
        return SizedBox(
          height: double.infinity,
          child: SingleChildScrollView(
            child: Padding(
              padding: EdgeInsets.fromLTRB(16, 48, 16, keyboardSpace + 16),
              child: width >= 600 ? horizontalLayout : verticalLayout,
            ),
          ),
        );
      },
    );
  }
}
