package com.aiesec.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aiesec.model.Department;

public interface DepartmentRepo extends JpaRepository<Department, Long> {

}
