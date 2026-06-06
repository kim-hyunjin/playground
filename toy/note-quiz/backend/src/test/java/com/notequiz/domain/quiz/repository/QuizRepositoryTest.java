package com.notequiz.domain.quiz.repository;

import com.notequiz.domain.note.entity.Note;
import com.notequiz.domain.note.repository.NoteRepository;
import com.notequiz.domain.quiz.entity.Question;
import com.notequiz.domain.quiz.entity.Quiz;
import com.notequiz.domain.user.entity.User;
import com.notequiz.domain.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class QuizRepositoryTest {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NoteRepository noteRepository;

    @Test
    @DisplayName("퀴즈 및 질문 저장 및 조회 테스트")
    void saveAndFindQuizWithQuestions() {
        // given
        User user = User.builder()
                .email("quiz@example.com")
                .passwordHash("hash")
                .nickname("quizzer")
                .build();
        userRepository.save(user);

        Note note = Note.builder()
                .title("Note 1")
                .extractedText("This is a test note.")
                .build();
        noteRepository.save(note);

        Quiz quiz = Quiz.builder()
                .user(user)
                .note(note)
                .shareToken("token123")
                .build();

        Question question1 = Question.builder()
                .body("What is this?")
                .options(List.of("A", "B", "C", "D"))
                .answer(0)
                .orderNum(1)
                .build();

        Question question2 = Question.builder()
                .body("Is this a test?")
                .options(List.of("Yes", "No"))
                .answer(0)
                .orderNum(2)
                .build();

        quiz.addQuestion(question1);
        quiz.addQuestion(question2);

        // when
        Quiz savedQuiz = quizRepository.save(quiz);
        Quiz foundQuiz = quizRepository.findById(savedQuiz.getId()).orElseThrow();

        // then
        assertThat(foundQuiz.getShareToken()).isEqualTo("token123");
        assertThat(foundQuiz.getUser().getEmail()).isEqualTo("quiz@example.com");
        assertThat(foundQuiz.getNote().getTitle()).isEqualTo("Note 1");
        assertThat(foundQuiz.getQuestions()).hasSize(2);
        assertThat(foundQuiz.getQuestions().get(0).getBody()).isEqualTo("What is this?");
        assertThat(foundQuiz.getQuestions().get(0).getOptions()).containsExactly("A", "B", "C", "D");
    }
}
