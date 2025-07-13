package com.aiesec.service.impl;

import com.aiesec.dto.TaskDto;
import com.aiesec.dto.UserProgressDto;
import com.aiesec.enums.UserRole;
import com.aiesec.exception.ResourcesNotFoundException;
import com.aiesec.model.*;
import com.aiesec.repository.TaskProofRepo;
import com.aiesec.repository.TaskRepo;
import com.aiesec.repository.UserRepository;
import com.aiesec.service.interfaces.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepo taskRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private TaskProofRepo taskProofRepo;

    @Transactional
    @Override
    public TaskDto createTask(TaskDto taskDto, Integer id) {
        User assigner = userRepo.findById(Long.valueOf(id))
                .orElseThrow(() -> new ResourcesNotFoundException("User", "id", id));

        Task task = DtoToTask(taskDto);

        if (taskDto.getAssignedTo() != null && taskDto.getAssignedTo().getId() != null) {
            User assignee = userRepo.findById(Long.valueOf(taskDto.getAssignedTo().getId()))
                    .orElseThrow(() -> new ResourcesNotFoundException("User", "assignedTo", taskDto.getAssignedTo().getId()));

            boolean allowed = false;

            switch (assigner.getRole()) {
                case LCP:
                    allowed = List.of(UserRole.LCVP, UserRole.Team_Leader, UserRole.Member)
                            .contains(assignee.getRole());
                    break;
                case LCVP:
                    allowed = List.of(UserRole.Team_Leader, UserRole.Member).contains(assignee.getRole())
                            && assigner.getDepartment() != null
                            && assignee.getDepartment() != null
                            && assigner.getDepartment().getId().equals(assignee.getDepartment().getId());
                    break;
                case Team_Leader:
                    allowed = assignee.getRole() == UserRole.Member
                            && assigner.getDepartment() != null
                            && assignee.getDepartment() != null
                            && assigner.getDepartment().getId().equals(assignee.getDepartment().getId());
                    break;
            }

            if (!allowed) {
                throw new RuntimeException("Not allowed to assign task: hierarchy or department violation.");
            }

            task.setAssignedToId(assignee.getId()); // ✅ set ID
        }

        task.setAssignedById(assigner.getId()); // ✅ set ID
        task.setUser(assigner); // still keep owner if needed

        Task savedTask = taskRepo.save(task);

        Integer currentCount = assigner.getNoOfTask();
        if (currentCount == null) {
            currentCount = 0;
        }
        assigner.setNoOfTask(currentCount + 1);
        userRepo.save(assigner);

        return taskToDto(savedTask);
    }





    @Override
    public TaskDto taskUpdate(TaskDto taskDto, Integer taskId, Integer id) {
        Task task = this.taskRepo.findById(taskId)
                .orElseThrow(() -> new ResourcesNotFoundException("Task", "taskId", taskId));

        // Fetch the user to assign the task to
        User user = this.userRepo.findById(Long.valueOf(id))
                .orElseThrow(() -> new ResourcesNotFoundException("User", "id", id));

        // Update task fields
        task.setTaskName(taskDto.getTaskName());
        task.setDescription(taskDto.getDescription());
        task.setDeadLine(taskDto.getDeadLine());
        task.setPriority(taskDto.getPriority());
        task.setUser(user); // Assign to the new user
        task.setWorkOfStatus(taskDto.getWorkOfStatus());

        Task updatedTask = this.taskRepo.save(task);
        return this.taskToDto(updatedTask);
    }




    @Override
    public TaskDto getTaskById(Integer taskId, Integer id) {
        User user = this.userRepo.findById(Long.valueOf(id))
                .orElseThrow(() -> new ResourcesNotFoundException("User", "User Id", id));

        List<Task> tasks = this.taskRepo.findByUser(user);
        Task task = tasks.stream()
                .filter(obj -> Objects.equals(obj.getTaskId(), taskId))
                .findFirst()
                .orElseThrow(() -> new ResourcesNotFoundException("Task", "task Id", taskId));

        return this.taskToDto(task);
    }

    @Override
    public void deleteTask(Integer taskId, Integer id) {
        User user = this.userRepo.findById(Long.valueOf(id))
                .orElseThrow(() -> new ResourcesNotFoundException("User", "User Id", id));

        Task task = this.taskRepo.findById(taskId)
                .orElseThrow(() -> new ResourcesNotFoundException("Task", "task Id", taskId));

        if (!task.getAssignedById().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to delete this task.");
        }

        this.taskRepo.delete(task);
    }


    @Override
    public List<TaskDto> getAllTasksByUser(Integer id) {
        User user = this.userRepo.findById(Long.valueOf(id))
                .orElseThrow(() -> new ResourcesNotFoundException("User", "User Id", id));

        List<Task> tasks = this.taskRepo.findByUser(user);
        return tasks.stream().map(this::taskToDto).toList();
    }

    @Override
    public List<TaskDto> getTasksAssignedToUser(Integer id) {
        // Convert Integer to Long if needed
        Long assignedToId = id.longValue();

        List<Task> tasks = taskRepo.findByAssignedToId(assignedToId);
        return tasks.stream().map(this::taskToDto).collect(Collectors.toList());
    }


    @Override
    public TaskDto getTaskByIdAndUserId(Integer taskId, Integer userId) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new ResourcesNotFoundException("Task", "taskId", taskId));

        // Check using your DTO or manually if assigned_to is not mapped to an entity field
        throw new ResourcesNotFoundException("Task not assigned to user with id", "userId", userId);

    }



    // ========== Mappers ==========

    public Task DtoToTask(TaskDto taskDto) {
        Task task = new Task();
        task.setTaskId(taskDto.getTaskId());
        task.setTaskName(taskDto.getTaskName());
        task.setDescription(taskDto.getDescription());
        task.setPriority(taskDto.getPriority());
        task.setDeadLine(taskDto.getDeadLine());
        task.setWorkOfStatus(taskDto.getWorkOfStatus());
        return task;
    }

    public TaskDto taskToDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setTaskId(task.getTaskId());
        dto.setTaskName(task.getTaskName());
        dto.setDeadLine(task.getDeadLine());
        dto.setDescription(task.getDescription());
        dto.setPriority(task.getPriority());
        dto.setWorkOfStatus(task.getWorkOfStatus());
        dto.setCompletedAt(task.getCompletedAt());

        // Set creator ID (task owner)
        if (task.getUser() != null) {
            dto.setId(Math.toIntExact(task.getUser().getId()));
        } else {
            dto.setId(null);
        }

        if (task.getAssignedToId() != null) {
            User assignedUser = userRepo.findById(task.getAssignedToId()).orElse(null);
            if (assignedUser != null) {
                dto.setAssignedTo(new TaskDto.AssignedUserDTO(
                        assignedUser.getId().intValue(),
                        assignedUser.getFirstName(),
                        assignedUser.getNoOfTask() // or 0 if no such field
                ));
            } else {
                dto.setAssignedTo(null);
            }
        } else {
            dto.setAssignedTo(null);
        }

        // Same for assignedBy
        if (task.getAssignedById() != null) {
            User assigner = userRepo.findById(task.getAssignedById()).orElse(null);
            if (assigner != null) {
                dto.setAssignedBy(new TaskDto.AssignedUserDTO(
                        assigner.getId().intValue(),
                        assigner.getFirstName(),
                        assigner.getNoOfTask()
                ));
            } else {
                dto.setAssignedBy(null);
            }
        } else {
            dto.setAssignedBy(null);
        }

        if (task.getProofs() != null && !task.getProofs().isEmpty()) {
            TaskProof proof = task.getProofs().get(0);
            dto.setNote(proof.getNote());
            dto.setFilePath(proof.getFilePath());
        }

        return dto;
    }

    @Override
    public Map<String, Long> getTaskCountByStatus() {
        List<Object[]> results = taskRepo.countTasksByWorkStatus();
        Map<String, Long> statusMap = new HashMap<>();

        for (Object[] row : results) {
            String status = (String) row[0];
            Long count = (Long) row[1];
            statusMap.put(status, count);
        }

        return statusMap;
    }

    @Override
    public void updateTaskStatus(Integer taskId, String status) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));

        task.setWorkOfStatus(status);

        if ("completed".equalsIgnoreCase(status)) {
            task.setCompletedAt(LocalDateTime.now());
        } else {
            task.setCompletedAt(null);  // reset if re-opened
        }

        taskRepo.save(task);
    }


    @Override
    public List<UserProgressDto> getUserProgressList(Long loggedInUserId) {
        User loggedInUser = userRepo.findById(loggedInUserId)
                .orElseThrow(() -> new RuntimeException("Logged in user not found"));

        List<User> allUsers = userRepo.findAll();
        List<User> filteredUsers = new ArrayList<>();

        switch (loggedInUser.getRole()) {
            case LCP -> {
                filteredUsers = allUsers.stream()
                        .filter(u -> u.getRole() == UserRole.LCVP
                                || u.getRole() == UserRole.Team_Leader
                                || u.getRole() == UserRole.Member)
                        .toList();
            }
            case LCVP -> {
                filteredUsers = allUsers.stream()
                        .filter(u ->
                                (u.getRole() == UserRole.Team_Leader || u.getRole() == UserRole.Member)
                                        && u.getFunction() != null
                                        && loggedInUser.getFunction() != null
                                        && u.getFunction().getId().equals(loggedInUser.getFunction().getId())
                        )
                        .toList();
            }
            case Team_Leader -> {
                filteredUsers = allUsers.stream()
                        .filter(u -> u.getRole() == UserRole.Member
                                && u.getFunction() != null
                                && loggedInUser.getFunction() != null
                                && u.getFunction().getId().equals(loggedInUser.getFunction().getId())
                        )
                        .toList();
            }

            case Member -> {
                filteredUsers = allUsers.stream()
                        .filter(u -> !u.getId().equals(loggedInUser.getId())
                                && u.getRole() == UserRole.Member
                                && u.getFunction() != null
                                && loggedInUser.getFunction() != null
                                && u.getFunction().getId().equals(loggedInUser.getFunction().getId()))
                        .toList();
            }
            default -> throw new RuntimeException("Unknown role");
        }

        List<UserProgressDto> result = new ArrayList<>();
        for (User user : filteredUsers) {
            List<Task> tasks = taskRepo.findByAssignedToId(Math.toIntExact(user.getId()));
            long total = tasks.size();
            long completed = tasks.stream()
                    .filter(t -> "completed".equalsIgnoreCase(t.getWorkOfStatus()))
                    .count();
            double progress = total == 0 ? 0.0 : ((double) completed / total) * 100;

            UserProgressDto dto = new UserProgressDto();
            dto.setId(Math.toIntExact(user.getId()));
            dto.setName(user.getFirstName());
            dto.setEmail(user.getEmail());
            dto.setTotalTasks(total);
            dto.setCompletedTasks(completed);
            dto.setProgressPercentage(progress);
            dto.setProfilePicture(user.getProfilePicture());
            dto.setRole(user.getRole());

            if (user.getDepartment() != null) {
                Department dept = new Department();
                dept.setId(user.getDepartment().getId());
                dept.setName(user.getDepartment().getName());
                dto.setDepartment(dept);
            }

            if (user.getFunction() != null) {
                Function func = new Function();
                func.setId(user.getFunction().getId());
                func.setName(user.getFunction().getName());
                dto.setFunction(func);
            }

            result.add(dto);
        }

        return result;
    }


    @Override
    public void saveProof(Integer taskId, Integer id, MultipartFile file, String note) throws IOException {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        User user = userRepo.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException("User not found"));

        String filePath = null;

        if (file != null && !file.isEmpty()) {
            // Directory on disk to save file
            String uploadDir = "uploads/task_" + taskId + "/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Save file physically
            Path fileFullPath = uploadPath.resolve(file.getOriginalFilename());
            Files.write(fileFullPath, file.getBytes());

            // Save only relative path WITHOUT "uploads/" to DB
            // because your Spring Boot serves files from /static/ directly
            filePath = "uploads/task_" + taskId + "/" + file.getOriginalFilename();
        }

        // Save TaskProof entity
        TaskProof proof = new TaskProof();
        proof.setTask(task);
        proof.setUser(user);
        proof.setNote(note);
        proof.setFilePath(filePath);

        taskProofRepo.save(proof);
    }




    public Task convertToEntity(TaskDto taskDto) {
        Task task = new Task();
        task.setTaskId(taskDto.getTaskId());
        task.setTaskName(taskDto.getTaskName());
        task.setDeadLine(taskDto.getDeadLine());
        task.setDescription(taskDto.getDescription());
        task.setPriority(taskDto.getPriority());
        task.setWorkOfStatus(taskDto.getWorkOfStatus());

        if (taskDto.getAssignedBy() != null) {
            task.setAssignedById(Long.valueOf(taskDto.getAssignedBy().getId()));
        }

        if (taskDto.getAssignedTo() != null) {
            task.setAssignedToId(Long.valueOf(taskDto.getAssignedTo().getId()));
        }

        return task;
    }






}

