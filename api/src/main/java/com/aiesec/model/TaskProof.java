package com.aiesec.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "task_proofs")
@Getter
@Setter
public class TaskProof {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer proofId;

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String note;

    private String filePath;

    private LocalDateTime uploadedAt = LocalDateTime.now();
}

