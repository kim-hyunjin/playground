package com.notequiz.domain.quiz.entity;

import com.notequiz.common.entity.BaseTimeEntity;
import com.notequiz.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "quiz_results")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class QuizResult extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "result_id", nullable = false, unique = true)
    private String resultId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false)
    private Integer total;

    @OneToMany(mappedBy = "quizResult", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WrongAnswer> wrongAnswers = new ArrayList<>();

    @Builder
    public QuizResult(Quiz quiz, User user, Integer score, Integer total) {
        this.resultId = UUID.randomUUID().toString();
        this.quiz = quiz;
        this.user = user;
        this.score = score;
        this.total = total;
    }

    public void addWrongAnswer(WrongAnswer wrongAnswer) {
        this.wrongAnswers.add(wrongAnswer);
    }
}
