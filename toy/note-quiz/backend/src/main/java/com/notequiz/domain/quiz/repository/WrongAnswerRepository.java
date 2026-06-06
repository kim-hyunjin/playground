package com.notequiz.domain.quiz.repository;

import com.notequiz.domain.quiz.entity.WrongAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WrongAnswerRepository extends JpaRepository<WrongAnswer, Long> {
    List<WrongAnswer> findByUserIdAndResolved(Long userId, boolean resolved);
}
