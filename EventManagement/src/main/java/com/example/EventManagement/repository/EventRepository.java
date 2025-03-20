package com.example.EventManagement.repository;

import com.example.EventManagement.entity.Event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Custom query to find events by name
    List<Event> findByEventNameContainingIgnoreCase(String eventName);
}
