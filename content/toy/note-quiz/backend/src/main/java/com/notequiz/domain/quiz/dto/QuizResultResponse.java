package com.notequiz.domain.quiz.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class QuizResultResponse {
    private Long id;
    private String resultId;
    private String quizId;
    private int score;
    private int total;
    private List<WrongQuestionResponse> wrongQuestions;

    @Getter
    @Builder
    public static class WrongQuestionResponse {
        private Long id;
        private String body;
        private List<String> options;
        private int answer;
        private int userAnswer;
        private String explanation;
    }
}
