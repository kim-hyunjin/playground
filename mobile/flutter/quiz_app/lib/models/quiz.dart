class Quiz {
  const Quiz(
      {required this.question,
      required this.options,
      required this.correctAnswer});

  final String question;
  final List<String> options;
  final String correctAnswer;

  List<String> get shuffledOptions {
    var returnedList = List.of(options);
    returnedList.shuffle();
    return returnedList;
  }
}
