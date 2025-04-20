package com.example.EventManagement.repository;

import com.example.EventManagement.entity.EventExperience;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventExperienceRepository extends JpaRepository<EventExperience, Long> {

    List<EventExperience> findByEvent_EventId(Long eventId);
    List<EventExperience> findByUser_UserId(Long userId);
}
