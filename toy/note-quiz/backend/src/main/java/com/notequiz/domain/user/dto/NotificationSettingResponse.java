package com.notequiz.domain.user.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.notequiz.domain.notification.entity.NotificationSetting;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationSettingResponse {
    private Boolean dailyQuizEnabled;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime dailyQuizTime;
    private List<TargetNoteDto> targetNotes;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TargetNoteDto {
        private String noteId;
        private String title;
        private Integer questionCount;
        private Boolean selected;
    }

    public static NotificationSettingResponse from(NotificationSetting setting, List<com.notequiz.domain.note.entity.Note> allNotes) {
        java.util.Map<String, Integer> selectedNotesMap = setting.getTargetNotes().stream()
                .collect(java.util.stream.Collectors.toMap(tn -> tn.getNote().getNoteId(), tn -> tn.getQuestionCount()));

        return NotificationSettingResponse.builder()
                .dailyQuizEnabled(setting.getDailyQuizEnabled())
                .dailyQuizTime(setting.getDailyQuizTime() != null ? setting.getDailyQuizTime() : LocalTime.of(9, 0))
                .targetNotes(allNotes.stream()
                        .map(note -> TargetNoteDto.builder()
                                .noteId(note.getNoteId())
                                .title(note.getTitle())
                                .selected(selectedNotesMap.containsKey(note.getNoteId()))
                                .questionCount(selectedNotesMap.getOrDefault(note.getNoteId(), 5))
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
