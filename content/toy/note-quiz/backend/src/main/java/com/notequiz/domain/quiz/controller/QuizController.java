package com.notequiz.domain.quiz.controller;

import com.notequiz.domain.quiz.dto.QuizGenerateRequest;
import com.notequiz.domain.quiz.dto.QuizResponse;
import com.notequiz.domain.quiz.dto.QuizResultRequest;
import com.notequiz.domain.quiz.dto.QuizResultResponse;
import com.notequiz.domain.quiz.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @PostMapping("/generate")
    public ResponseEntity<QuizResponse> generateQuiz(@RequestBody QuizGenerateRequest request) {
        QuizResponse response = quizService.generateQuiz(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<QuizResponse> getQuiz(@PathVariable("quizId") String quizId) {
        QuizResponse response = quizService.getQuiz(quizId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{quizId}/result")
    public ResponseEntity<QuizResultResponse> submitResult(
            @PathVariable("quizId") String quizId,
            @RequestBody QuizResultRequest request) {
        QuizResultResponse response = quizService.submitResult(quizId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/share/{shareToken}")
    public ResponseEntity<QuizResponse> getSharedQuiz(@PathVariable("shareToken") String shareToken) {
        QuizResponse response = quizService.getSharedQuiz(shareToken);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/result/{resultId}")
    public ResponseEntity<QuizResultResponse> getQuizResult(@PathVariable("resultId") String resultId) {
        QuizResultResponse response = quizService.getQuizResult(resultId);
        return ResponseEntity.ok(response);
    }
}
