package com.notequiz.domain.notification.entity;

import com.notequiz.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "notification_settings")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NotificationSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "daily_quiz_enabled", nullable = false)
    private Boolean dailyQuizEnabled;

    @Column(name = "daily_quiz_time")
    private LocalTime dailyQuizTime;

    @OneToMany(mappedBy = "notificationSetting", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NotificationTargetNote> targetNotes = new ArrayList<>();

    @Builder
    public NotificationSetting(User user, Boolean dailyQuizEnabled, LocalTime dailyQuizTime) {
        this.user = user;
        this.dailyQuizEnabled = dailyQuizEnabled != null ? dailyQuizEnabled : false;
        this.dailyQuizTime = dailyQuizTime;
    }

    public void update(Boolean dailyQuizEnabled, LocalTime dailyQuizTime) {
        this.dailyQuizEnabled = dailyQuizEnabled;
        this.dailyQuizTime = dailyQuizTime;
    }

    public void addTargetNote(NotificationTargetNote targetNote) {
        this.targetNotes.add(targetNote);
        targetNote.setNotificationSetting(this);
    }

    public void clearTargetNotes() {
        this.targetNotes.clear();
    }
}
