package com.example.EventManagement.controller;

import com.example.EventManagement.dto.EventExperienceDTO;
import com.example.EventManagement.entity.EventExperience;
import com.example.EventManagement.service.interfaces.EventExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event-experiences")
public class EventExperienceController {

    private final EventExperienceService eventExperienceService;

    @Autowired
    public EventExperienceController(EventExperienceService eventExperienceService) {
        this.eventExperienceService = eventExperienceService;
    }

    // 🔹 Create Feedback
    @PostMapping
    public ResponseEntity<EventExperienceDTO> createExperience(@RequestBody EventExperienceDTO experienceDTO) {
        EventExperienceDTO createdExperience = eventExperienceService.createExperience(experienceDTO);
        return new ResponseEntity<>(createdExperience, HttpStatus.CREATED);
    }


    // 🔹 Get all Feedback
    @GetMapping
    public ResponseEntity<List<EventExperience>> getAllExperiences() {
        List<EventExperience> experiences = eventExperienceService.getAllExperiences();
        return ResponseEntity.ok(experiences);
    }

    // 🔹 Get Feedback by ID
    @GetMapping("/{id}")
    public ResponseEntity<EventExperienceDTO> getExperienceById(@PathVariable Long id) { // Changed to Long
        EventExperienceDTO experience = eventExperienceService.getExperienceById(id); // Changed to Long
        return ResponseEntity.ok(experience);
    }

    // 🔹 Update Feedback
    @PutMapping("/{id}")
    public ResponseEntity<EventExperienceDTO> updateExperience(@PathVariable Long id, @RequestBody EventExperienceDTO experienceDTO) { // Changed to Long
        EventExperienceDTO updated = eventExperienceService.updateExperience(id, experienceDTO);
        return ResponseEntity.ok(updated);
    }

    // 🔹 Delete Feedback
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable Long id) { // Changed to Long
        eventExperienceService.deleteExperience(id); // Changed to Long
        return ResponseEntity.noContent().build();
    }

    // 🔹 Get Feedback by Event ID
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<EventExperienceDTO>> getByEventId(@PathVariable Long eventId) { // Changed to Long
        List<EventExperienceDTO> experiences = eventExperienceService.getExperiencesByEventId(eventId); // Changed to Long
        return ResponseEntity.ok(experiences);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EventExperienceDTO>> getExperiencesByUser(@PathVariable Long userId) {
        List<EventExperienceDTO> experiences = eventExperienceService.getExperiencesByUserId(userId);
        return ResponseEntity.ok(experiences);
    }

    @PostMapping("/share")
    public ResponseEntity<EventExperienceDTO> shareExperience(@RequestBody EventExperienceDTO dto) {
        EventExperienceDTO shared = eventExperienceService.shareExperience(dto);
        return ResponseEntity.ok(shared);
    }

    @PostMapping("/add")
    public ResponseEntity<EventExperienceDTO> addExperience(@RequestBody EventExperienceDTO dto) {
        EventExperienceDTO added = eventExperienceService.addExperience(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(added);
    }



}