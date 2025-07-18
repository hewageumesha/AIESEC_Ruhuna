package com.aiesec.controller;


import com.aiesec.dto.TaskDto;
import com.aiesec.dto.UserDTO;
import com.aiesec.dto.UserProgressDto;
import com.aiesec.enums.Priority;
import com.aiesec.exception.ResourcesNotFoundException;
import com.aiesec.model.User;
import com.aiesec.repository.UserRepository;
import com.aiesec.service.UserService;
import com.aiesec.service.interfaces.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class TaskController {

    @Autowired
    private TaskService taskService;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepo;


    // ✅ POST: Create Task with Default Priority if not provided
    // POST: Create Task with Assigned User
    @PostMapping("/{id}/task/")
    public ResponseEntity<TaskDto> createTask(@RequestBody TaskDto taskDto, @PathVariable Integer id) {
        if (taskDto.getPriority() == null) {
            taskDto.setPriority(Priority.MEDIUM);
        }
        if (taskDto.getWorkOfStatus() == null || taskDto.getWorkOfStatus().isEmpty()) {
            taskDto.setWorkOfStatus("pending");
        }
        TaskDto createdTask = taskService.createTask(taskDto, id);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

//    @GetMapping("/profile/id/{id}")
//    public ResponseEntity<User> getProfileById(@PathVariable Integer id) {
//        User user = userRepo.findById(Long.valueOf(id))
//                .orElseThrow(() -> new ResourcesNotFoundException("User", "id", id));
//        return ResponseEntity.ok(user);
//    }


    // ✅ PUT: Update Task
    @PutMapping("/{id}/{taskId}/")
    public ResponseEntity<TaskDto> updateTask(@RequestBody TaskDto taskDto, @PathVariable Integer id, @PathVariable Integer taskId) {
        TaskDto updatedTaskDto = this.taskService.taskUpdate(taskDto, taskId, id);
        return ResponseEntity.ok(updatedTaskDto);
    }


    // ✅ DELETE: Delete Task
    @DeleteMapping("/{id}/{taskId}/")
    public ResponseEntity<?> deleteTask(@PathVariable Integer id, @PathVariable Integer taskId) {
        this.taskService.deleteTask(taskId, id);
        return new ResponseEntity<>(Map.of("message", "Deleted successfully"), HttpStatus.OK);
    }

    // ✅ GET: Get All Tasks for User
    @GetMapping("/{id}/tasks/")
    public ResponseEntity<List<TaskDto>> getAllTasks(@PathVariable Integer id) {
        List<TaskDto> tasks = this.taskService.getAllTasksByUser(id);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/task/{taskId}/updateStatus")
    public ResponseEntity<?> updateTaskStatus(
            @PathVariable Integer taskId,
            @RequestParam String status
    ) {
        taskService.updateTaskStatus(taskId, status);
        return ResponseEntity.ok(Map.of("message", "Task status updated successfully"));
    }


    // GET: Fetch all users for dropdown (Assign To)
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}/assigned/")
    public ResponseEntity<List<TaskDto>> getAssignedTasks(@PathVariable Integer id) {
        List<TaskDto> tasks = taskService.getTasksAssignedToUser(id);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping("/task/{taskId}/upload-proof")
    public ResponseEntity<?> uploadProof(@PathVariable Integer taskId,
                                         @RequestParam("id") Integer id,
                                         @RequestParam("proof") MultipartFile file,
                                         @RequestParam("note") String note) throws IOException {
        taskService.saveProof(taskId, id, file, note);
        return ResponseEntity.ok(Map.of("message", "Proof uploaded successfully"));
    }


    @GetMapping("/tasks/status-count")
    public ResponseEntity<Map<String, Long>> getTaskStatusCount() {
        return ResponseEntity.ok(taskService.getTaskCountByStatus());
    }

    @GetMapping("/progress")
    public ResponseEntity<List<UserProgressDto>> getUserProgress(@RequestParam Long userId) {
        List<UserProgressDto> progressList = taskService.getUserProgressList(userId);
        return ResponseEntity.ok(progressList);
    }
    @GetMapping("/{id}/notification")
    public ResponseEntity<List<TaskDto>> getTasksAssignedToUser(@PathVariable Integer id) {
        List<TaskDto> tasks = taskService.getTasksAssignedToUser(id);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}/task/{taskId}")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable Integer id, @PathVariable Integer taskId) {
        TaskDto taskDto = taskService.getTaskByIdAndUserId(taskId, id);
        return ResponseEntity.ok(taskDto);
    }
}

