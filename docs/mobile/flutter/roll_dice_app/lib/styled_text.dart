import 'package:flutter/material.dart';

class StyledText extends StatelessWidget {
  final TextStyle style;
  final String value;

  const StyledText(this.value,
      {super.key,
      this.style = const TextStyle(color: Colors.white, fontSize: 28)});

  @override
  Widget build(BuildContext context) {
    return Text(
      value,
      style: style,
    );
  }
}
