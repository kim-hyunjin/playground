// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:quiz_app/data/quiz_list.dart';

import 'package:quiz_app/main.dart';
import 'package:quiz_app/models/quiz.dart';

void main() {
  testWidgets('start screen test', (WidgetTester tester) async {
    await tester.pumpWidget(const QuizApp());

    expect(find.text('Start Quiz'), findsOneWidget);

    await tester.tap(find.text('Start Quiz'));
    await tester.pump();

    expect(find.byKey(const Key('question')), findsOneWidget);
  });

  testWidgets('test question screen', (WidgetTester tester) async {
    await tester.pumpWidget(const QuizApp());

    expect(find.text('Start Quiz'), findsOneWidget);

    await tester.tap(find.text('Start Quiz'));
    await tester.pump();

    for (Quiz quiz in quizList) {
      await tester.tap(find.byKey(Key('option_${quiz.options[0]}')));
      await tester.pump();
    }

    expect(find.byKey(const Key('result_title')), findsOneWidget);
  });

  testWidgets('test restart', (WidgetTester tester) async {
    await tester.pumpWidget(const QuizApp());
    await tester.tap(find.text('Start Quiz'));
    await tester.pump();

    for (Quiz quiz in quizList) {
      await tester.tap(find.byKey(Key('option_${quiz.options[0]}')));
      await tester.pump();
    }

    expect(find.byKey(const Key('restart_button')), findsOneWidget);

    await tester.tap(find.byKey(const Key('restart_button')));
    await tester.pump();
    expect(find.text(quizList[0].question), findsOneWidget);
    expect(
        find.byKey(Key('option_${quizList[0].options.length}')), findsNothing);

    for (Quiz quiz in quizList) {
      await tester.tap(
          find.byKey(Key('option_${quiz.options[quiz.options.length - 1]}')));
      await tester.pump();
    }

    expect(find.byKey(const Key('result_title')), findsOneWidget);
  });
}
