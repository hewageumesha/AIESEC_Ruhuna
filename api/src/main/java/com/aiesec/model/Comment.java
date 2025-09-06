package com.aiesec.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "member_id")
    private Long member;
    @Column(name = "created_by_id")
    private Long createdBy;
    private String content;
    private LocalDateTime createdAt = LocalDateTime.now(); 
}
