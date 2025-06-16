package com.aiesec.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aiesec.model.Function;

public interface FunctionRepo extends JpaRepository<Function, Long> {
}
