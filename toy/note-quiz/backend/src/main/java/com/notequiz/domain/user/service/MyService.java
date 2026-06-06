package com.notequiz.domain.user.service;

import com.notequiz.common.exception.ApiException;
import com.notequiz.common.exception.ErrorCode;
import com.notequiz.domain.note.dto.NoteResponse;
import com.notequiz.domain.note.entity.Note;
import com.notequiz.domain.note.repository.NoteRepository;
import com.notequiz.domain.notification.entity.NotificationSetting;
import com.notequiz.domain.notification.entity.NotificationTargetNote;
import com.notequiz.domain.notification.repository.NotificationSettingRepository;
import com.notequiz.domain.quiz.dto.QuizResponse;
import com.notequiz.domain.quiz.dto.WrongAnswerResponse;
import com.notequiz.domain.quiz.entity.Quiz;
import com.notequiz.domain.quiz.entity.WrongAnswer;
import com.notequiz.domain.quiz.repository.QuizRepository;
import com.notequiz.domain.quiz.repository.WrongAnswerRepository;
import com.notequiz.domain.user.dto.NotificationSettingResponse;
import com.notequiz.domain.user.entity.User;
import com.notequiz.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MyService {

    private final NoteRepository noteRepository;
    private final QuizRepository quizRepository;
    private final WrongAnswerRepository wrongAnswerRepository;
    private final UserRepository userRepository;
    private final NotificationSettingRepository notificationSettingRepository;

    public List<NoteResponse> getMyNotes() {
        User user = getRequiredCurrentUser();
        return noteRepository.findByUser(user).stream()
                .map(NoteResponse::from)
                .collect(Collectors.toList());
    }

    public List<QuizResponse> getQuizzesByNote(String noteId) {
        User user = getRequiredCurrentUser();
        Note note = noteRepository.findByNoteId(noteId)
                .orElseThrow(() -> new ApiException(ErrorCode.UPLOAD_NOT_FOUND));
        
        return quizRepository.findByNoteAndUser(note, user).stream()
                .map(QuizResponse::from)
                .collect(Collectors.toList());
    }

    public String shareQuiz(String quizId) {
        User user = getRequiredCurrentUser();
        Quiz quiz = quizRepository.findByQuizId(quizId)
                .orElseThrow(() -> new ApiException(ErrorCode.QUIZ_NOT_FOUND));
        
        if (quiz.getUser() == null || !quiz.getUser().getId().equals(user.getId())) {
            throw new ApiException(ErrorCode.FORBIDDEN);
        }

        if (quiz.getShareToken() == null) {
            // Generate share token: first 6 chars of UUID
            String token = UUID.randomUUID().toString().substring(0, 6);
            // In a real app, handle collisions. For simplicity, just set it.
            // Using a hacky way since Quiz doesn't have a setter for shareToken
            try {
                java.lang.reflect.Field field = Quiz.class.getDeclaredField("shareToken");
                field.setAccessible(true);
                field.set(quiz, token);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        
        return quiz.getShareToken();
    }

    public List<WrongAnswerResponse> getMyWrongAnswers() {
        User user = getRequiredCurrentUser();
        return wrongAnswerRepository.findByUserIdAndResolved(user.getId(), false).stream()
                .map(WrongAnswerResponse::from)
                .collect(Collectors.toList());
    }

    public void resolveWrongAnswer(Long wrongId) {
        User user = getRequiredCurrentUser();
        WrongAnswer wrongAnswer = wrongAnswerRepository.findById(wrongId)
                .orElseThrow(() -> new ApiException(ErrorCode.RESULT_NOT_FOUND));
        
        if (!wrongAnswer.getUser().getId().equals(user.getId())) {
            throw new ApiException(ErrorCode.FORBIDDEN);
        }
        
        wrongAnswer.resolve();
    }

    public NotificationSettingResponse getNotificationSettings() {
        User user = getRequiredCurrentUser();
        NotificationSetting setting = getOrCreateNotificationSetting(user);
        List<Note> allNotes = noteRepository.findByUser(user);
        return NotificationSettingResponse.from(setting, allNotes);
    }

    public NotificationSettingResponse updateNotificationSettings(NotificationSettingResponse request) {
        User user = getRequiredCurrentUser();
        NotificationSetting setting = getOrCreateNotificationSetting(user);
        
        setting.update(request.getDailyQuizEnabled(), request.getDailyQuizTime());
        setting.clearTargetNotes();
        
        if (request.getTargetNotes() != null) {
            for (NotificationSettingResponse.TargetNoteDto dto : request.getTargetNotes()) {
                if (Boolean.TRUE.equals(dto.getSelected())) {
                    Note note = noteRepository.findByNoteId(dto.getNoteId())
                            .orElseThrow(() -> new ApiException(ErrorCode.UPLOAD_NOT_FOUND));
                    setting.addTargetNote(NotificationTargetNote.builder()
                            .note(note)
                            .questionCount(dto.getQuestionCount())
                            .build());
                }
            }
        }
        
        List<Note> allNotes = noteRepository.findByUser(user);
        return NotificationSettingResponse.from(setting, allNotes);
    }

    private User getRequiredCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new ApiException(ErrorCode.UNAUTHORIZED);
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
    }

    private NotificationSetting getOrCreateNotificationSetting(User user) {
        return notificationSettingRepository.findByUser(user)
                .orElseGet(() -> {
                    NotificationSetting newSetting = NotificationSetting.builder()
                            .user(user)
                            .dailyQuizEnabled(false)
                            .build();
                    return notificationSettingRepository.save(newSetting);
                });
    }
}
