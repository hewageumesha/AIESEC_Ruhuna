package com.taskmanagementsystem.server.service.impl;

import com.taskmanagementsystem.server.entities.Task;
import com.taskmanagementsystem.server.entities.User;
import com.taskmanagementsystem.server.exception.ResourcesNotFoundException;
import com.taskmanagementsystem.server.payloads.TaskDto;
import com.taskmanagementsystem.server.repositories.TaskRepo;
import com.taskmanagementsystem.server.repositories.UserRepo;
import com.taskmanagementsystem.server.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class TaskServiceImpl implements TaskService {
    @Autowired
    private TaskRepo taskRepo;
    @Autowired
    private UserRepo userRepo;
    @Override
    public TaskDto createTask(TaskDto taskDto, Integer userId) {
        // Fetch the user who will create the task
        User user = this.userRepo.findById(userId)
                .orElseThrow(() -> new ResourcesNotFoundException("User", "userId", userId));

        // Convert TaskDto to Task entity
        Task task = this.DtoToTask(taskDto);

        if (taskDto.getAssignedTo() != null) {
            User assignee = this.userRepo.findById(taskDto.getAssignedTo()).orElseThrow(() -> new ResourcesNotFoundException("User", "assignedTo", taskDto.getAssignedTo()));
            task.setAssignedTo(assignee);
        }

        // Increment the number of tasks assigned to the user
        user.setNoOfTask(user.getNoOfTask() + 1);

        // Associate the task with the user
        task.setUser(user);

        // Save the task entity to the database
        Task saved = this.taskRepo.save(task);

        // Save the user (if the noOfTask update needs to be persisted separately)
        this.userRepo.save(user);

        // Convert the saved task entity back to TaskDto to return to the client
        return this.taskToDto(saved);
    }
    @Override
    public TaskDto taskUpdate(TaskDto taskDto, Integer taskId, Integer UserId) {
        Task task=this.taskRepo.findById(taskId).orElseThrow(()-> new ResourcesNotFoundException("User","User Id",taskId));
        User user=this.userRepo.findById(UserId).orElseThrow(()-> new ResourcesNotFoundException("User","User Id",UserId));
        user.getTasks().remove(task);
        task.setTaskName(taskDto.getTaskName());
        task.setDescription(taskDto.getDescription());
        task.setDeadLine(taskDto.getDeadLine());
        task.setWorkOfStatus(taskDto.getWorkOfStatus());
        task.setPriority(taskDto.getPriority());
        task.setUser(user);

        if(taskDto.getAssignedTo() != null){
            User assignedUser = userRepo.findById(taskDto.getAssignedTo())
                    .orElseThrow(ResourcesNotFoundException::new);
            task.setAssignedTo(assignedUser);
        }



        user.getTasks().add(task);

        Task UpdatedTask=this.taskRepo.save(task);

        return this.taskToDto(UpdatedTask);
    }

    @Override
    public TaskDto getTaskById(Integer taskId,Integer UserId){
        User user=this.userRepo.findById(UserId).orElseThrow(()-> new ResourcesNotFoundException("User","User Id",UserId));
        List<Task> tasks=this.taskRepo.findByUser(user);
        Task task = tasks.stream().filter(obj -> Objects.equals(obj.getTaskId(), taskId)).findFirst().orElseThrow(()-> new ResourcesNotFoundException("Task","task Id",(long)taskId));
        return this.taskToDto(task);
    }

    @Override
    public void deleteTask(Integer taskId,Integer UserId) {
        User user=this.userRepo.findById(UserId).orElseThrow(()-> new ResourcesNotFoundException("User","User Id",UserId));
        Task task=this.taskRepo.findById(taskId).orElseThrow(()-> new ResourcesNotFoundException("Task","task Id",(long)taskId));
        user.getTasks().remove(task);
        this.taskRepo.delete(task);
    }

    @Override
    public List<TaskDto> getAllTasksByUser(Integer UserId) {
        User user=this.userRepo.findById(UserId).orElseThrow(()-> new ResourcesNotFoundException("User","User Id",(long)UserId));
        List<Task> tasks=this.taskRepo.findByUser(user);
        return tasks.stream().map(this::taskToDto).toList();
    }

    public Task DtoToTask(TaskDto taskDto){
        Task task=new Task();
        task.setTaskId(taskDto.getTaskId());
        task.setTaskName(taskDto.getTaskName());
        task.setDescription(taskDto.getDescription());
        task.setPriority(taskDto.getPriority());
        task.setDeadLine(taskDto.getDeadLine());
        task.setWorkOfStatus(taskDto.getWorkOfStatus());
        return task;
    }
    public TaskDto taskToDto(Task task){
        TaskDto taskDto=new TaskDto();
        taskDto.setTaskId(task.getTaskId());
        taskDto.setTaskName(task.getTaskName());
        taskDto.setDescription(task.getDescription());
        taskDto.setPriority(task.getPriority());
        taskDto.setDeadLine(task.getDeadLine());
        taskDto.setWorkOfStatus(task.getWorkOfStatus());
        return  taskDto;
    }
}
