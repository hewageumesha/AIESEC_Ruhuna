package com.aiesec.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aiesec.model.Function;

@Repository
public interface FunctionRepo extends JpaRepository<Function, Long> {
}
