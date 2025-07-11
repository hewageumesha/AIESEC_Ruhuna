package com.aiesec.repository;

import com.aiesec.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
  
    List<Expense> findAllById(Iterable<Long> ids);
}
