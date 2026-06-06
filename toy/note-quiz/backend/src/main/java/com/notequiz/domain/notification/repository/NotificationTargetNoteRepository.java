package com.notequiz.domain.notification.repository;

import com.notequiz.domain.notification.entity.NotificationTargetNote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationTargetNoteRepository extends JpaRepository<NotificationTargetNote, Long> {
}
