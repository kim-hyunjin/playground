package com.notequiz.domain.note.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NoteUploadResponse {
    private String noteId;
    private String title;
    private int extractedTextLength;
}
