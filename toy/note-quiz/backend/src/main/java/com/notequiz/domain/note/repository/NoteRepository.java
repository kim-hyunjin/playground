package com.notequiz.domain.note.repository;

import com.notequiz.domain.note.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import com.notequiz.domain.user.entity.User;
import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    Optional<Note> findByNoteId(String noteId);
    List<Note> findByUser(User user);
}
