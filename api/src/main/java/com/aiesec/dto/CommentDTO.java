package com.aiesec.dto;

import java.time.LocalDateTime;

import com.aiesec.model.User;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CommentDTO {
    private Long id;
    private String content;
    private User member;
    private User createdBy;
    private LocalDateTime createdAt;

    public CommentDTO(Long id, String content, User createdBy, User member, LocalDateTime createdAt) {
        this.id = id;
        this.content = content;
        this.member = member;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

}
