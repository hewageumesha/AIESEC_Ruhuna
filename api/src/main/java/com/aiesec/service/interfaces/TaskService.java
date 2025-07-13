package com.aiesec.service.interfaces;


import com.aiesec.dto.TaskDto;
import com.aiesec.dto.UserProgressDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface TaskService {
    TaskDto createTask(TaskDto taskDto, Integer id);
    TaskDto taskUpdate(TaskDto taskDto,Integer taskId,Integer id);


    TaskDto getTaskById(Integer taskId,Integer id);
    void deleteTask(Integer TaskId,Integer id);
    List<TaskDto> getAllTasksByUser(Integer id);




    List<TaskDto> getTasksAssignedToUser(Integer userId);


    TaskDto getTaskByIdAndUserId(Integer taskId, Integer id);

    Map<String, Long> getTaskCountByStatus();

   // List<UserProgressDto> getUserProgressList();

    void updateTaskStatus(Integer taskId, String status);

    void saveProof(Integer taskId, Integer id, MultipartFile file, String note) throws IOException;

    List<UserProgressDto> getUserProgressList(Long userId);
}

