package com.aiesec.dto;

import com.aiesec.enums.UserRole;
import com.aiesec.model.Department;
import com.aiesec.model.Function;
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
    private String profilePicture;
    private Department department;
    private Function function;
    private UserRole role;


    // Getters and Setters
}
