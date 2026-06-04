package com.notequiz.domain.quiz.dto;

import com.notequiz.domain.quiz.entity.Question;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class QuestionResponse {
    private Long id;
    private String body;
    private List<String> options;
    private Integer answer;
    private String explanation;
    private Integer orderNum;

    public static QuestionResponse from(Question question) {
        return QuestionResponse.builder()
                .id(question.getId())
                .body(question.getBody())
                .options(question.getOptions())
                .answer(question.getAnswer())
                .explanation(question.getExplanation())
                .orderNum(question.getOrderNum())
                .build();
    }
}
