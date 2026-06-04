package com.notequiz.domain.quiz.repository;

import com.notequiz.domain.note.entity.Note;
import com.notequiz.domain.user.entity.User;
import com.notequiz.domain.quiz.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Optional<Quiz> findByQuizId(String quizId);
    Optional<Quiz> findByShareToken(String shareToken);
    List<Quiz> findByNoteAndUser(Note note, User user);
}
