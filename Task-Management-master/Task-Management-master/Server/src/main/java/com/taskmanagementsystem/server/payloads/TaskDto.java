package com.taskmanagementsystem.server.payloads;

import com.taskmanagementsystem.server.entities.Priority;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@NoArgsConstructor
@Getter
@Setter
public class TaskDto {
    private Integer TaskId;
    private String taskName;
    private Date deadLine;
    private String description;
    private Priority priority;
    private String workOfStatus;
    private Integer userId;
    private Integer assignedTo;
}
