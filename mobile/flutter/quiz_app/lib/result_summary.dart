import 'package:flutter/material.dart';

class ResultSummary extends StatelessWidget {
  const ResultSummary({super.key, required this.summaryData});

  final List<Map<String, Object>> summaryData;

  @override
  Widget build(BuildContext context) {
    return Flexible(
      child: ListView(
        children: [
          ...summaryData.map((data) => SummaryItem(data: data)),
        ],
      ),
    );
  }
}

class SummaryItem extends StatelessWidget {
  const SummaryItem({super.key, required this.data});

  final Map<String, Object> data;

  @override
  Widget build(BuildContext context) {
    bool isCorrect = data['user_answer'] == data['correct_answer'];
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ResultIndicator(id: (data['index'] as int) + 1, isCorrect: isCorrect),
        const SizedBox(
          width: 16,
        ),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                data['question'].toString(),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(
                height: 5,
              ),
              Text(
                data['user_answer'].toString(),
                style: const TextStyle(color: Colors.purpleAccent),
              ),
              Text(
                data['correct_answer'].toString(),
                style: const TextStyle(color: Colors.tealAccent),
              ),
              const SizedBox(
                height: 10,
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class ResultIndicator extends StatelessWidget {
  const ResultIndicator({super.key, required this.id, required this.isCorrect});

  final int id;
  final bool isCorrect;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: isCorrect ? Colors.blueAccent : Colors.pinkAccent,
        shape: BoxShape.circle,
      ),
      padding: const EdgeInsets.all(10),
      child: Text(
        id.toString(),
        style: const TextStyle(
          fontSize: 16,
        ),
      ),
    );
  }
}
