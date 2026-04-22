import 'package:flutter/material.dart';
import 'package:quiz_app/answer_button.dart';
import 'package:quiz_app/models/quiz.dart';
import 'package:google_fonts/google_fonts.dart';

class QuestionScreen extends StatefulWidget {
  const QuestionScreen(
      {super.key, required this.quizList, required this.onChooseAnswer});

  final List<Quiz> quizList;
  final void Function(String answer) onChooseAnswer;

  @override
  State<StatefulWidget> createState() {
    return _QuiestionSreenState();
  }
}

class _QuiestionSreenState extends State<QuestionScreen> {
  int currentQuizIndex = 0;

  void chooseAnswer(String selectedAnswer) {
    widget.onChooseAnswer(selectedAnswer);
    setState(() {
      currentQuizIndex++;
    });
  }

  @override
  Widget build(BuildContext context) {
    Quiz currentQuiz = widget.quizList[currentQuizIndex];

    return Center(
      child: Container(
        margin: const EdgeInsets.all(40),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              currentQuiz.question,
              key: const Key('question'),
              style: GoogleFonts.roboto(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(
              height: 30,
            ),
            ...currentQuiz.shuffledOptions.map((e) => AnswerButton(
                  key: Key('option_$e'),
                  text: e,
                  onTab: () {
                    chooseAnswer(e);
                  },
                )),
          ],
        ),
      ),
    );
  }
}
