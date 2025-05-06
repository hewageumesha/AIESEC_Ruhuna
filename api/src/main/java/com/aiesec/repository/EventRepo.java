package com.aiesec.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aiesec.model.Function;

public interface EventRepo extends JpaRepository<Function, Long> {
}
