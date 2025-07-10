package com.aiesec.dto;

import java.time.LocalDateTime;

import com.aiesec.model.User;

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public User getMember() {
        return member;
    }

    public void setMember(User member) {
        this.member = member;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }
    
}
