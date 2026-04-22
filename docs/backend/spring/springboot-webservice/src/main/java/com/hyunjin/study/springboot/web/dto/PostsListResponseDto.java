package com.hyunjin.study.springboot.web.dto;

import com.hyunjin.study.springboot.domain.posts.Posts;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
public class PostsListResponseDto {
    private Long id;
    private String title;
    private String author;
    private LocalDateTime modifiedDate;
    private String formattedDate;

    public PostsListResponseDto(Posts entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.author = entity.getAuthor();
        this.modifiedDate = entity.getModifiedDate();
        this.formattedDate = modifiedDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }
}
