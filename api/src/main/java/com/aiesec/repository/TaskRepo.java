package com.aiesec.repository;

import com.aiesec.model.Task;
import com.aiesec.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepo extends JpaRepository<Task, Integer> {
    List<Task> findByUser(User user);


    List<Task> findByAssignedToId(Integer id);
    List<Task> findByAssignedToId(Long assignedToId);

    @Query("SELECT t.workOfStatus, COUNT(t) FROM Task t GROUP BY t.workOfStatus")
    List<Object[]> countTasksByWorkStatus();


    List<Task> findByWorkOfStatusAndCompletedAtBefore(String status, LocalDateTime dateTime);

}