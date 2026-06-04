package com.notequiz.domain.note.controller;

import com.notequiz.domain.note.dto.NoteUploadResponse;
import com.notequiz.domain.note.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @PostMapping
    public ResponseEntity<NoteUploadResponse> uploadNote(
            @RequestParam("title") String title,
            @RequestParam("file") MultipartFile file) {
        NoteUploadResponse response = noteService.uploadNote(title, file);
        return ResponseEntity.ok(response);
    }
}
