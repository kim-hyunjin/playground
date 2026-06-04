package com.notequiz.domain.quiz.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class QuizResultRequest {
    private List<Integer> answers;
}
