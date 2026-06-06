package com.notequiz.domain.note.service;

import com.notequiz.common.exception.ApiException;
import com.notequiz.common.exception.ErrorCode;
import com.notequiz.domain.note.dto.NoteUploadResponse;
import com.notequiz.domain.note.entity.Note;
import com.notequiz.domain.note.repository.NoteRepository;
import com.notequiz.common.client.OllamaClient;
import com.notequiz.domain.user.entity.User;
import com.notequiz.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final OllamaClient ollamaClient;

    @Value("${ollama.dummy-mode:false}")
    private boolean dummyMode;

    public NoteUploadResponse uploadNote(String title, MultipartFile file) {
        validateFile(file);

        String extractedText = extractText(file);
        String cleanedText = cleanText(extractedText);

        User currentUser = getCurrentUser();

        Note note = Note.builder()
                .user(currentUser)
                .title(title)
                .extractedText(cleanedText)
                .build();

        noteRepository.save(note);

        return NoteUploadResponse.builder()
                .noteId(note.getNoteId())
                .title(note.getTitle())
                .extractedTextLength(cleanedText.length())
                .build();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return null;
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElse(null);
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ApiException(ErrorCode.INVALID_FILE_FORMAT);
        }

        if (file.getSize() > 20 * 1024 * 1024) {
            throw new ApiException(ErrorCode.FILE_TOO_LARGE);
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("application/pdf") &&
                !contentType.startsWith("image/"))) {
            throw new ApiException(ErrorCode.INVALID_FILE_FORMAT);
        }
    }

    private String extractText(MultipartFile file) {
        String contentType = Objects.requireNonNull(file.getContentType());

        try {
            if (contentType.equals("application/pdf")) {
                return extractTextFromPdf(file);
            } else if (contentType.startsWith("image/")) {
                return extractTextFromImage(file);
            }
        } catch (Exception e) {
            log.error("Text extraction failed", e);
            throw new ApiException(ErrorCode.TEXT_EXTRACT_FAILED);
        }

        throw new ApiException(ErrorCode.INVALID_FILE_FORMAT);
    }

    protected String extractTextFromPdf(MultipartFile file) throws IOException {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    protected String extractTextFromImage(MultipartFile file) throws IOException {
        if (dummyMode) {
            log.info("Ollama dummy mode is enabled. Returning hardcoded Markdown text.");
            return "# 핵심 개념: 광합성 (Photosynthesis)\n\n" +
                   "## 1. 개요\n" +
                   "식물이 빛 에너지를 이용하여 유기물을 합성하는 과정.\n\n" +
                   "## 2. 장소\n" +
                   "- **엽록체 (Chloroplast)**: 주요 반응이 일어나는 세포 소기관.\n" +
                   "- **틸라코이드**: 명반응 발생.\n" +
                   "- **스트로마**: 암반응(캘빈 회로) 발생.\n\n" +
                   "## 3. 화학식\n" +
                   "$6CO_2 + 12H_2O + \\text{빛 에너지} \\rightarrow C_6H_{12}O_6 + 6O_2 + 6H_2O$\n\n" +
                   "## 4. 주요 단계\n" +
                   "1. **명반응**: 물의 광분해, ATP 및 NADPH 생성.\n" +
                   "2. **암반응**: 이산화탄소 고정, 포도당 합성.";
        }

        byte[] imageBytes = file.getBytes();
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);
        String prompt = "이미지는 공부한 노트야. 노트 내용을 markdown으로 정리해줘. 정리한 markdown 이외 다른 설명은 붙이지 마.";

        try {
            return ollamaClient.generateWithImage(prompt, base64Image);
        } catch (Exception e) {
            log.error("Failed to extract text from image using OllamaClient", e);
            throw new ApiException(ErrorCode.TEXT_EXTRACT_FAILED);
        }
    }

    private String cleanText(String text) {
        if (text == null) return "";
        // Remove consecutive spaces and normalize special characters if needed
        return text.replaceAll("\\s+", " ").trim();
    }
}
