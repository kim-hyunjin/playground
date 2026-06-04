package com.notequiz.domain.quiz.dto;

import com.notequiz.domain.quiz.entity.Quiz;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class QuizResponse {
    private Long id;
    private String quizId;
    private List<QuestionResponse> questions;
    private LocalDateTime createdAt;
    private int questionCount;

    public static QuizResponse from(Quiz quiz) {
        return QuizResponse.builder()
                .id(quiz.getId())
                .quizId(quiz.getQuizId())
                .questions(quiz.getQuestions().stream()
                        .map(QuestionResponse::from)
                        .collect(Collectors.toList()))
                .createdAt(quiz.getCreatedAt())
                .questionCount(quiz.getQuestions().size())
                .build();
    }
}
