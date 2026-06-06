package com.notequiz.domain.quiz.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.notequiz.common.client.OllamaClient;
import com.notequiz.domain.note.entity.Note;
import com.notequiz.domain.note.repository.NoteRepository;
import com.notequiz.domain.quiz.dto.QuizGenerateRequest;
import com.notequiz.domain.quiz.dto.QuizResponse;
import com.notequiz.domain.quiz.dto.QuizResultRequest;
import com.notequiz.domain.quiz.dto.QuizResultResponse;
import com.notequiz.domain.quiz.entity.Question;
import com.notequiz.domain.quiz.entity.Quiz;
import com.notequiz.domain.quiz.repository.QuizRepository;
import com.notequiz.domain.quiz.repository.QuizResultRepository;
import com.notequiz.domain.quiz.repository.WrongAnswerRepository;
import com.notequiz.domain.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class QuizServiceTest {

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private NoteRepository noteRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OllamaClient ollamaClient;

    @Mock
    private QuizResultRepository quizResultRepository;

    @Mock
    private WrongAnswerRepository wrongAnswerRepository;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private QuizService quizService;

    @Test
    @DisplayName("퀴즈 결과를 제출하고 점수를 반환한다")
    void submitResult() {
        // given
        String quizId = "test-quiz-id";
        Quiz quiz = Quiz.builder().build();
        Question q1 = Question.builder().body("Q1").answer(0).orderNum(1).build();
        Question q2 = Question.builder().body("Q2").answer(1).orderNum(2).build();
        quiz.addQuestion(q1);
        quiz.addQuestion(q2);

        given(quizRepository.findByQuizId(quizId)).willReturn(Optional.of(quiz));

        QuizResultRequest request = new QuizResultRequest();
        setField(request, "answers", List.of(0, 0)); // q1 correct (0==0), q2 wrong (0!=1)

        // when
        QuizResultResponse response = quizService.submitResult(quizId, request);

        // then
        assertThat(response.getScore()).isEqualTo(1);
        assertThat(response.getTotal()).isEqualTo(2);
        verify(quizResultRepository).save(any());
    }

    @Test
    @DisplayName("노트 정보를 바탕으로 퀴즈를 생성한다")
    void generateQuiz() throws JsonProcessingException {
        // given
        String noteId = "test-note-id";
        Note note = Note.builder()
                .title("Test Note")
                .extractedText("This is a test content for quiz generation.")
                .build();
        given(noteRepository.findByNoteId(noteId)).willReturn(Optional.of(note));

        String llmResponse = """
                [
                  {
                    "body": "What is this?",
                    "options": ["Test", "Quiz", "Note", "App"],
                    "answer": 0,
                    "explanation": "It's a test."
                  }
                ]
                """;
        given(ollamaClient.generate(anyString())).willReturn(llmResponse);

        QuizGenerateRequest request = new QuizGenerateRequest();
        // Use reflection or change DTO to have a constructor/setter for testing
        // For simplicity, I'll use a hacky way or just assume it works if fields match
        setField(request, "noteId", noteId);
        setField(request, "questionCount", 1);

        // when
        QuizResponse response = quizService.generateQuiz(request);

        // then
        assertThat(response.getQuestions()).hasSize(1);
        assertThat(response.getQuestions().get(0).getBody()).isEqualTo("What is this?");
        verify(quizRepository).save(any());
    }

    private void setField(Object target, String fieldName, Object value) {
        try {
            java.lang.reflect.Field field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
