import 'package:flutter/material.dart';

class GradientContainer extends StatelessWidget {
  const GradientContainer(
      {super.key,
      required this.beginColor,
      required this.endColor,
      this.startAlignment = Alignment.topLeft,
      this.endAlignment = Alignment.bottomRight,
      this.child});

  const GradientContainer.purple(
      {super.key,
      this.startAlignment = Alignment.topLeft,
      this.endAlignment = Alignment.bottomRight,
      this.child})
      : beginColor = Colors.purple,
        endColor = Colors.blue;
  const GradientContainer.orange(
      {super.key,
      this.startAlignment = Alignment.topLeft,
      this.endAlignment = Alignment.bottomRight,
      this.child})
      : beginColor = Colors.orange,
        endColor = Colors.yellow;

  final Color beginColor;
  final Color endColor;
  final Alignment startAlignment;
  final Alignment endAlignment;
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
            colors: [beginColor, endColor],
            begin: startAlignment,
            end: endAlignment),
      ),
      child: Center(child: child),
    );
  }
}
