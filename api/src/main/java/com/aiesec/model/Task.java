package com.aiesec.model;

import com.aiesec.dto.TaskDto;
import com.aiesec.enums.Priority;
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
    @JoinColumn(name = "user_user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @ManyToOne
    @JoinColumn(name = "assigned_by")
    private User assignedBy;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<TaskProof> proofs = new java.util.ArrayList<>();

    // Optional: Provide setter that maps from DTO (can be removed if unused)


    public void setAssignedBy(User assigner) {
        this.assignedBy = assigner;
    }

}
