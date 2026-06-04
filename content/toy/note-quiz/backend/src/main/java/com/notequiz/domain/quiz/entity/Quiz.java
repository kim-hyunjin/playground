package com.notequiz.domain.quiz.entity;

import com.notequiz.common.entity.BaseTimeEntity;
import com.notequiz.domain.note.entity.Note;
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
@Table(name = "quizzes")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Quiz extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quiz_id", nullable = false, unique = true)
    private String quizId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id")
    private Note note;

    @Column(name = "share_token")
    private String shareToken;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();

    @Builder
    public Quiz(User user, Note note, String shareToken) {
        this.quizId = UUID.randomUUID().toString();
        this.user = user;
        this.note = note;
        this.shareToken = shareToken;
    }

    public void addQuestion(Question question) {
        this.questions.add(question);
        question.setQuiz(this);
    }
}
