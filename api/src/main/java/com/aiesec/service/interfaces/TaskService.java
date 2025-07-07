package com.aiesec.service.interfaces;


import com.aiesec.dto.TaskDto;
import com.aiesec.dto.UserProgressDto;

import java.util.List;
import java.util.Map;

public interface TaskService {
    TaskDto createTask(TaskDto taskDto, Integer id);
    TaskDto taskUpdate(TaskDto taskDto,Integer taskId,Integer id);


    TaskDto getTaskById(Integer taskId,Integer id);
    void deleteTask(Integer TaskId,Integer id);
    List<TaskDto> getAllTasksByUser(Integer id);




    List<TaskDto> getTasksAssignedToUser(Integer userId);


    Map<String, Long> getTaskCountByStatus();

    List<UserProgressDto> getUserProgressList();
}

