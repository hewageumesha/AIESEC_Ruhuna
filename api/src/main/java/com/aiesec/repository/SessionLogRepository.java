package com.aiesec.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aiesec.model.SessionLog;

@Repository
public interface SessionLogRepository extends JpaRepository<SessionLog, Long> {
    Optional<SessionLog> findTopByUserEmailOrderByLoginTimeDesc(String userEmail);
}
