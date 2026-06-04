package com.notequiz.domain.notification.entity;

import com.notequiz.domain.note.entity.Note;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notification_target_notes")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NotificationTargetNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notification_setting_id", nullable = false)
    private NotificationSetting notificationSetting;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id", nullable = false)
    private Note note;

    @Column(name = "question_count", nullable = false)
    private Integer questionCount;

    @Builder
    public NotificationTargetNote(Note note, Integer questionCount) {
        this.note = note;
        this.questionCount = questionCount;
    }

    protected void setNotificationSetting(NotificationSetting notificationSetting) {
        this.notificationSetting = notificationSetting;
    }
}
