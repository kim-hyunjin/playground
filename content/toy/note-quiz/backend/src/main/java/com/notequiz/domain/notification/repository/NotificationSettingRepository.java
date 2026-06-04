package com.notequiz.domain.notification.repository;

import com.notequiz.domain.notification.entity.NotificationSetting;
import com.notequiz.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface NotificationSettingRepository extends JpaRepository<NotificationSetting, Long> {
    Optional<NotificationSetting> findByUser(User user);

    @Query("SELECT DISTINCT s FROM NotificationSetting s " +
           "JOIN FETCH s.user " +
           "LEFT JOIN FETCH s.targetNotes tn " +
           "LEFT JOIN FETCH tn.note " +
           "WHERE s.dailyQuizEnabled = true")
    List<NotificationSetting> findAllByDailyQuizEnabledTrue();
}
