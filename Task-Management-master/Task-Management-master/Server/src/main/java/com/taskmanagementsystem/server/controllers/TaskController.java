package com.taskmanagementsystem.server.controllers;

import com.taskmanagementsystem.server.payloads.TaskDto;
import com.taskmanagementsystem.server.service.TaskService;
import com.taskmanagementsystem.server.entities.Priority; // ✅ Import the Enum
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // ✅ POST: Create Task with Default Priority if not provided
    @PostMapping("/{userId}/task/")
    public ResponseEntity<TaskDto> createTask(@RequestBody TaskDto taskDto, @PathVariable Integer userId) {
        if (taskDto.getPriority() == null) {
            taskDto.setPriority(Priority.MEDIUM); // ✅ Default Priority to MEDIUM
        }
        TaskDto createdTaskDto = this.taskService.createTask(taskDto, userId);
        return new ResponseEntity<>(createdTaskDto, HttpStatus.CREATED);
    }

    // ✅ PUT: Update Task
    @PutMapping("/{userId}/{taskId}/")
    public ResponseEntity<TaskDto> updateTask(@RequestBody TaskDto taskDto, @PathVariable Integer userId, @PathVariable Integer taskId) {
        TaskDto updatedTaskDto = this.taskService.taskUpdate(taskDto, taskId, userId);
        return ResponseEntity.ok(updatedTaskDto);
    }

    // ✅ DELETE: Delete Task
    @DeleteMapping("/{userId}/{taskId}/")
    public ResponseEntity<?> deleteTask(@PathVariable Integer userId, @PathVariable Integer taskId) {
        this.taskService.deleteTask(taskId, userId);
        return new ResponseEntity<>(Map.of("message", "Deleted successfully"), HttpStatus.OK);
    }

    // ✅ GET: Get Task by ID
    @GetMapping("/{userId}/{taskId}/")
    public ResponseEntity<TaskDto> getTask(@PathVariable Integer userId, @PathVariable Integer taskId) {
        TaskDto taskDto = this.taskService.getTaskById(taskId, userId);
        return new ResponseEntity<>(taskDto, HttpStatus.OK);
    }

    // ✅ GET: Get All Tasks for User
    @GetMapping("/{userId}/tasks/")
    public ResponseEntity<List<TaskDto>> getAllTasks(@PathVariable Integer userId) {
        List<TaskDto> tasks = this.taskService.getAllTasksByUser(userId);
        return ResponseEntity.ok(tasks);
    }
}
