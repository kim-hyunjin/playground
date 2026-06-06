import 'package:flutter/material.dart';
import 'package:roll_dice_app/styled_text.dart';
import 'dart:math';

class DiceRoller extends StatefulWidget {
  const DiceRoller({super.key});

  @override
  State<DiceRoller> createState() {
    return _DiceRollerState();
  }
}

final randomizer = Random();

// _ mean only can use in this file's scope
class _DiceRollerState extends State<DiceRoller> {
  var currentDiceNumber = 2;
  void rollDice() {
    setState(() {
      currentDiceNumber = randomizer.nextInt(6) + 1;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Image.asset(
          'assets/images/dice-$currentDiceNumber.png',
          width: 200,
        ),
        const SizedBox(
          height: 20,
        ),
        TextButton(
          onPressed: rollDice,
          // style:
          //     TextButton.styleFrom(padding: const EdgeInsets.only(top: 20)),
          child: const StyledText('press'),
        )
      ],
    );
  }
}
