import 'package:flutter/material.dart';
import 'package:roll_dice_app/dice_roller.dart';
import 'package:roll_dice_app/gradient_container.dart';

void main() {
  runApp(const MyApp());
}

const mainColor = Color.fromARGB(255, 49, 0, 133);
const subColor = Color.fromARGB(255, 91, 56, 151);

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: GradientContainer(
          beginColor: mainColor, endColor: subColor, child: DiceRoller()),
    );
  }
}
