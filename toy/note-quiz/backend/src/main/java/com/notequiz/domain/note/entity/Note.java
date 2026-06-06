package com.notequiz.domain.note.entity;

import com.notequiz.common.entity.BaseTimeEntity;
import com.notequiz.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "notes")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Note extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "note_id", nullable = false, unique = true)
    private String noteId;

    @Column(nullable = false)
    private String title;

    @Lob
    @Column(name = "extracted_text", columnDefinition = "TEXT")
    private String extractedText;

    @Builder
    public Note(User user, String title, String extractedText) {
        this.noteId = UUID.randomUUID().toString();
        this.user = user;
        this.title = title;
        this.extractedText = extractedText;
    }
}
