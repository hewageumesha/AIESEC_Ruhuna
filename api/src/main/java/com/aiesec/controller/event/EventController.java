package com.aiesec.controller.event;


import com.aiesec.dto.EventDTO;
import com.aiesec.service.interfaces.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // Create Event
    @PostMapping
    public ResponseEntity<EventDTO> createEvent(@RequestBody EventDTO eventDTO) {
        EventDTO createdEvent = eventService.createEvent(eventDTO);
        return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
    }

    // Update Event
    @PutMapping("/{eventId}")
    public ResponseEntity<EventDTO> updateEvent(@PathVariable Long eventId, @RequestBody EventDTO updatedEvent) {
        EventDTO event = eventService.updateEvent(eventId, updatedEvent);
        return (event != null) ? new ResponseEntity<>(event, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Get All Events (Admin only)
    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllEvents() {
        List<EventDTO> events = eventService.getAllEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    // Get Event by ID
    @GetMapping("/{eventId}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable String eventId) {
        try {
            Long id = Long.valueOf(eventId);
            EventDTO event = eventService.getEventById(id);
            return (event != null) ? new ResponseEntity<>(event, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (NumberFormatException e) {
            System.err.println("Invalid eventId: " + eventId);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Delete Event
    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Search filter
    @GetMapping("/filter")
    public ResponseEntity<Page<EventDTO>> filterEvents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String date,
            Pageable pageable) {
        Page<EventDTO> results = eventService.filterEvents(search, status, date, pageable);
        return ResponseEntity.ok(results);
    }

    // Get Public Events (for public event page)
    @GetMapping("/public")
    public ResponseEntity<List<EventDTO>> getPublicUpcomingEvents() {
        List<EventDTO> publicEvents = eventService.getPublicUpcomingEvents();
        return new ResponseEntity<>(publicEvents, HttpStatus.OK);
    }

    // Get Private Events (for members dashboard)
    @GetMapping("/private")
    public ResponseEntity<List<EventDTO>> getPrivateUpcomingEvents() {
        List<EventDTO> privateEvents = eventService.getPrivateUpcomingEvents();
        return new ResponseEntity<>(privateEvents, HttpStatus.OK);
    }

    // Get All Public Events
    @GetMapping("/public/all")
    public ResponseEntity<List<EventDTO>> getAllPublicEvents() {
        List<EventDTO> publicEvents = eventService.getAllPublicEvents();
        return new ResponseEntity<>(publicEvents, HttpStatus.OK);
    }

    // Get All Private Events
    @GetMapping("/private/all")
    public ResponseEntity<List<EventDTO>> getAllPrivateEvents() {
        List<EventDTO> privateEvents = eventService.getAllPrivateEvents();
        return new ResponseEntity<>(privateEvents, HttpStatus.OK);
    }
}