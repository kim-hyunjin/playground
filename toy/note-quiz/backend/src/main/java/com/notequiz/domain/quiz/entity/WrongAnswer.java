package com.notequiz.domain.quiz.entity;

import com.notequiz.common.entity.BaseTimeEntity;
import com.notequiz.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "wrong_answers")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WrongAnswer extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_result_id")
    private QuizResult quizResult;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(nullable = false)
    private Integer userAnswer;

    @Column(nullable = false)
    private Boolean resolved;

    @Builder
    public WrongAnswer(User user, Quiz quiz, QuizResult quizResult, Question question, Integer userAnswer, Boolean resolved) {
        this.user = user;
        this.quiz = quiz;
        this.quizResult = quizResult;
        this.question = question;
        this.userAnswer = userAnswer;
        this.resolved = resolved != null ? resolved : false;
    }

    public void resolve() {
        this.resolved = true;
    }
}
