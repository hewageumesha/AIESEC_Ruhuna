package com.aiesec.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProgressDto {
    private Integer id;
    private String name;
    private String email;
    private long totalTasks;
    private long completedTasks;
    private double progressPercentage;

    // Getters and Setters
}
