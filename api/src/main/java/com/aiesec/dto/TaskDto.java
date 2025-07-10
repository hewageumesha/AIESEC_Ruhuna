package com.aiesec.dto;

import com.aiesec.enums.Priority;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@NoArgsConstructor
@Getter
@Setter
public class TaskDto {

    private Integer taskId;
    private String taskName;
    private Date deadLine;
    private String description;
    private Priority priority;
    private String workOfStatus;

    private Integer id; // Creator of the task
    private AssignedUserDTO assignedTo; // User to whom task is assigned
    private AssignedUserDTO assignedBy; // User who assigned the task

    private String note;
    private String filePath;

    @NoArgsConstructor
    @Getter
    @Setter
    public static class AssignedUserDTO {
        private Integer id;
        private String username;
        private int numberOfTasks;


        public AssignedUserDTO(Integer id, String username, int numberOfTasks) {
            this.id = id;
            this.username = username;
            this.numberOfTasks = numberOfTasks;
        }
    }
}

