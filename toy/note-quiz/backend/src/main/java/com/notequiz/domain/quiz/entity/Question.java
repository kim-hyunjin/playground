package com.notequiz.domain.quiz.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "questions")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String body;

    @ElementCollection
    @CollectionTable(name = "question_options", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option_text")
    @OrderColumn(name = "option_order")
    private List<String> options;

    @Column(nullable = false)
    private Integer answer; // index of the correct option

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "order_num", nullable = false)
    private Integer orderNum;

    @Builder
    public Question(String body, List<String> options, Integer answer, String explanation, Integer orderNum) {
        this.body = body;
        this.options = options;
        this.answer = answer;
        this.explanation = explanation;
        this.orderNum = orderNum;
    }

    protected void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }
}
