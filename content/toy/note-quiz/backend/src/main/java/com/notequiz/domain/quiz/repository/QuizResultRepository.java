package com.notequiz.domain.quiz.repository;

import com.notequiz.domain.quiz.entity.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    Optional<QuizResult> findByResultId(String resultId);
}
