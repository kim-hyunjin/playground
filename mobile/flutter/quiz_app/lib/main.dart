import 'package:flutter/material.dart';
import 'package:quiz_app/data/quiz_list.dart';
import 'package:quiz_app/question_screen.dart';
import 'package:quiz_app/result_screen.dart';
import 'package:quiz_app/start_screen.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  runApp(const QuizApp());
}

class QuizApp extends StatefulWidget {
  const QuizApp({super.key});

  @override
  State<StatefulWidget> createState() {
    return _QuizAppState();
  }
}

enum ScreenType { start, question, result }

class _QuizAppState extends State<QuizApp> {
  ScreenType screenType = ScreenType.start;

  List<String> answerList = [];

  void changeScreen(ScreenType type) {
    setState(() {
      screenType = type;
    });
  }

  void chooseAnswer(String answer) {
    answerList.add(answer);

    if (answerList.length == quizList.length) {
      setState(() {
        screenType = ScreenType.result;
      });
    }
  }

  void clearAnswer() {
    setState(() {
      answerList = [];
    });
  }

  Widget renderScreen() {
    Widget activeScreen;
    switch (screenType) {
      case ScreenType.start:
        activeScreen = StartScreen(() {
          changeScreen(ScreenType.question);
        });
        break;
      case ScreenType.question:
        activeScreen = QuestionScreen(
          quizList: quizList,
          onChooseAnswer: chooseAnswer,
        );
        break;
      case ScreenType.result:
        activeScreen = ResultScreen(
          quizList: quizList,
          chosenAnswers: answerList,
          onRestart: () {
            clearAnswer();
            changeScreen(ScreenType.question);
          },
        );
        break;
    }

    return activeScreen;
  }

  // late Widget activeScreen;

  // @override
  // void initState() {
  //   super.initState();
  //   activeScreen = StartScreen(changeScreen);
  // }

  // void changeScreen() {
  //   setState(() {
  //     activeScreen = const QuestionScreen();
  //   });
  // }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Quiz App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
        textTheme: GoogleFonts.latoTextTheme(),
      ),
      home: Scaffold(
        body: Container(
          width: double.infinity,
          decoration: const BoxDecoration(color: Colors.deepPurple),
          child: renderScreen(),
        ),
      ),
    );
  }
}
