package com.aiesec.model;

import com.aiesec.dto.TaskDto;
import com.aiesec.enums.Priority;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.antlr.v4.runtime.misc.NotNull;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "task")
@Getter
@Setter
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer taskId;

    @Column(name = "task_name", nullable = false, length = 100)
    private String taskName;

    @NotNull
    @Column(name = "deadline_date", nullable = false)
    private Date deadLine;

    @Column(name = "description", length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private Priority priority;

    @Column(name = "work_of_status", nullable = false)
    private String workOfStatus;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;


    @ManyToOne
    private User user;

    @Column(name = "assigned_to")
    private Long assignedToId; // just store user ID

    @Column(name = "assigned_by")
    private Long assignedById; // just store user ID

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private java.util.List<TaskProof> proofs = new java.util.ArrayList<>();

    // Optional: Provide setter that maps from DTO (can be removed if unused)




}
