package com.notequiz.domain.note.service;

import com.notequiz.common.client.OllamaClient;
import com.notequiz.domain.note.dto.NoteUploadResponse;
import com.notequiz.domain.note.repository.NoteRepository;
import com.notequiz.domain.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NoteServiceTest {

    @Mock
    private NoteRepository noteRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OllamaClient ollamaClient;

    @InjectMocks
    @Spy
    private NoteService noteService;

    @Test
    @DisplayName("PDF 파일에서 텍스트를 추출하고 저장한다")
    void uploadPdfNote() throws IOException {
        // given
        String title = "Test PDF";
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.pdf", "application/pdf", "Test PDF Content".getBytes());
        doReturn("Extracted Text from PDF").when(noteService).extractTextFromPdf(any());

        // when
        NoteUploadResponse response = noteService.uploadNote(title, file);

        // then
        assertThat(response.getTitle()).isEqualTo(title);
        assertThat(response.getNoteId()).isNotNull();
        verify(noteRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("이미지 파일에서 텍스트를 추출하고 저장한다")
    void uploadImageNote() throws IOException {
        // given
        String title = "Test Image";
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.png", "image/png", "Test Image Content".getBytes());
        doReturn("Extracted Text from Image").when(noteService).extractTextFromImage(any());

        // when
        NoteUploadResponse response = noteService.uploadNote(title, file);

        // then
        assertThat(response.getTitle()).isEqualTo(title);
        assertThat(response.getNoteId()).isNotNull();
        assertThat(response.getExtractedTextLength()).isGreaterThan(0);
        verify(noteRepository, times(1)).save(any());
    }
}
