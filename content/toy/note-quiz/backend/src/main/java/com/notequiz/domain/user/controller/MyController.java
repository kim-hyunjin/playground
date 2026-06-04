package com.notequiz.domain.user.controller;

import com.notequiz.domain.note.dto.NoteResponse;
import com.notequiz.domain.quiz.dto.QuizResponse;
import com.notequiz.domain.quiz.dto.WrongAnswerResponse;
import com.notequiz.domain.user.dto.NotificationSettingResponse;
import com.notequiz.domain.user.service.MyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/my")
@RequiredArgsConstructor
public class MyController {

    private final MyService myService;

    @GetMapping("/notes")
    public ResponseEntity<List<NoteResponse>> getMyNotes() {
        return ResponseEntity.ok(myService.getMyNotes());
    }

    @GetMapping("/notes/{noteId}/quizzes")
    public ResponseEntity<List<QuizResponse>> getQuizzesByNote(@PathVariable("noteId") String noteId) {
        return ResponseEntity.ok(myService.getQuizzesByNote(noteId));
    }

    @PostMapping("/quizzes/{quizId}/share")
    public ResponseEntity<String> shareQuiz(@PathVariable("quizId") String quizId) {
        return ResponseEntity.ok(myService.shareQuiz(quizId));
    }

    @GetMapping("/wrong")
    public ResponseEntity<List<WrongAnswerResponse>> getMyWrongAnswers() {
        return ResponseEntity.ok(myService.getMyWrongAnswers());
    }

    @PatchMapping("/wrong/{wrongId}/resolve")
    public ResponseEntity<Void> resolveWrongAnswer(@PathVariable("wrongId") Long wrongId) {
        myService.resolveWrongAnswer(wrongId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/settings/notification")
    public ResponseEntity<NotificationSettingResponse> getNotificationSettings() {
        return ResponseEntity.ok(myService.getNotificationSettings());
    }

    @PutMapping("/settings/notification")
    public ResponseEntity<NotificationSettingResponse> updateNotificationSettings(
            @RequestBody NotificationSettingResponse request) {
        return ResponseEntity.ok(myService.updateNotificationSettings(request));
    }
}
