package com.aiesec.repository.Task;

import com.aiesec.model.TaskProof;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskProofRepo extends JpaRepository<TaskProof, Integer> {
    boolean existsByTask_TaskId(Integer taskId);

}
