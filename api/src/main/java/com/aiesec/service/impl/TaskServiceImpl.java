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
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
                    allowed = List.of(UserRole.LCVP, UserRole.Team_Leader, UserRole.Member).contains(assignee.getRole());
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

            task.setAssignedTo(assignee);
        }

        task.setAssignedBy(assigner);
        task.setUser(assigner);

        Task savedTask = taskRepo.save(task);
        assigner.setNoOfTask(assigner.getNoOfTask() + 1);
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

        user.getTasks().remove(task);
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
        List<Task> tasks = taskRepo.findByAssignedTo_Id(id);
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

        // Safe null check before accessing task.getUser()
        if (task.getUser() != null) {
            dto.setId(task.getUser().getId());
        } else {
            dto.setId(null);  // or some default value if needed
        }

        // Set assignedTo with null check
        if (task.getAssignedTo() != null) {
            TaskDto.AssignedUserDTO assignedTo = new TaskDto.AssignedUserDTO(
                    task.getAssignedTo().getId(),
                    task.getAssignedTo().getUserName(),
                    task.getAssignedTo().getNoOfTask()
            );
            dto.setAssignedTo(assignedTo);
        } else {
            dto.setAssignedTo(null);
        }

        // Set assignedBy with null check
        if (task.getAssignedBy() != null) {
            TaskDto.AssignedUserDTO assignedBy = new TaskDto.AssignedUserDTO(
                    task.getAssignedBy().getId(),
                    task.getAssignedBy().getUserName(),
                    task.getAssignedBy().getNoOfTask()
            );
            dto.setAssignedBy(assignedBy);
        } else {
            dto.setAssignedBy(null);
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
        taskRepo.save(task);
    }

    @Override
    public List<UserProgressDto> getUserProgressList(Long loggedInUserId) {
        User loggedInUser = userRepo.findById(loggedInUserId)
                .orElseThrow(() -> new RuntimeException("Logged in user not found"));

        List<User> allUsers = userRepo.findAll();
        List<User> filteredUsers = new ArrayList<>();

        // Check if logged in user is from ED function
        boolean isFromEDFunction = loggedInUser.getFunction() != null
                && "ED".equalsIgnoreCase(loggedInUser.getFunction().getName());

        if (isFromEDFunction) {
            // If user belongs to ED function, show all users
            filteredUsers = allUsers;
        } else {
            // Normal role based filtering
            switch (loggedInUser.getRole()) {
                case LCP -> {
                    filteredUsers = allUsers.stream()
                            .filter(u -> u.getRole() == UserRole.LCVP || u.getRole() == UserRole.Member)
                            .toList();
                }
                case LCVP -> {
                    filteredUsers = allUsers.stream()
                            .filter(u -> u.getRole() == UserRole.Team_Leader || u.getRole() == UserRole.Member)
                            .toList();
                }
                case Team_Leader -> {
                    filteredUsers = allUsers.stream()
                            .filter(u -> u.getTeamLeaderId() != null
                                    && u.getTeamLeaderId().equals(loggedInUser.getId().toString())
                                    && u.getRole() == UserRole.Member)
                            .toList();
                }
                case Member -> {
                    filteredUsers = allUsers.stream()
                            .filter(u -> !u.getId().equals(loggedInUser.getId())
                                    && u.getRole() == UserRole.Member
                                    && u.getDepartment() != null
                                    && loggedInUser.getDepartment() != null
                                    && u.getDepartment().getId().equals(loggedInUser.getDepartment().getId()))
                            .toList();
                }
                default -> throw new RuntimeException("Unknown role");
            }
        }

        // ... rest of your existing mapping logic for UserProgressDto

        List<UserProgressDto> result = new ArrayList<>();
        for (User user : filteredUsers) {
            List<Task> tasks = taskRepo.findByAssignedToId(user.getId());
            long total = tasks.size();
            long completed = tasks.stream()
                    .filter(t -> "completed".equalsIgnoreCase(t.getWorkOfStatus()))
                    .count();
            double progress = total == 0 ? 0.0 : ((double) completed / total) * 100;

            UserProgressDto dto = new UserProgressDto();
            dto.setId(user.getId());
            dto.setName(user.getUserName());
            dto.setEmail(user.getEmail());
            dto.setTotalTasks(total);
            dto.setCompletedTasks(completed);
            dto.setProgressPercentage(progress);

            dto.setProfilePicture(user.getProfilePicture());
            dto.setRole(user.getRole() != null ? UserRole.valueOf(user.getRole().toString()) : null);

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
            // Save file to disk
            String uploadDir = "uploads/task_" + taskId + "/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            filePath = uploadDir + file.getOriginalFilename();
            Path fileFullPath = uploadPath.resolve(file.getOriginalFilename());
            Files.write(fileFullPath, file.getBytes());
        }

        // Save TaskProof in DB with or without filePath
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
            User assignedByUser = new User();
            assignedByUser.setId(taskDto.getAssignedBy().getId());
            assignedByUser.setUserName(taskDto.getAssignedBy().getUsername());
            task.setAssignedBy(assignedByUser);
        }

        if (taskDto.getAssignedTo() != null) {
            User assignedToUser = new User();
            assignedToUser.setId(taskDto.getAssignedTo().getId());
            assignedToUser.setUserName(taskDto.getAssignedTo().getUsername());
            task.setAssignedTo(assignedToUser);
        }

        return task;
    }





}

