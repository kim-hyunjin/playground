package com.notequiz.domain.quiz.dto;

import com.notequiz.domain.quiz.entity.WrongAnswer;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class WrongAnswerResponse {
    private Long id;
    private QuestionResponse question;
    private Boolean resolved;

    public static WrongAnswerResponse from(WrongAnswer wrongAnswer) {
        return WrongAnswerResponse.builder()
                .id(wrongAnswer.getId())
                .question(QuestionResponse.from(wrongAnswer.getQuestion()))
                .resolved(wrongAnswer.getResolved())
                .build();
    }
}
