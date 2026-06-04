package com.notequiz.domain.note.controller;

import com.notequiz.common.security.JwtProvider;
import com.notequiz.domain.note.dto.NoteUploadResponse;
import com.notequiz.domain.note.service.NoteService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(NoteController.class)
class NoteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private NoteService noteService;

    @MockitoBean
    private JwtProvider jwtProvider;

    @Test
    @DisplayName("노트 업로드 API 호출 시 200을 반환한다")
    @WithMockUser
    void uploadNote() throws Exception {
        // given
        NoteUploadResponse response = NoteUploadResponse.builder()
                .noteId("test-id")
                .title("Test Title")
                .extractedTextLength(100)
                .build();
        given(noteService.uploadNote(anyString(), any())).willReturn(response);

        MockMultipartFile file = new MockMultipartFile(
                "file", "test.pdf", MediaType.APPLICATION_PDF_VALUE, "test content".getBytes());

        // when & then
        mockMvc.perform(multipart("/api/notes")
                        .file(file)
                        .param("title", "Test Title")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.noteId").value("test-id"))
                .andExpect(jsonPath("$.title").value("Test Title"));
    }
}
