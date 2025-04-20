package com.example.EventManagement.controller;

import com.example.EventManagement.dto.EventDTO;
import com.example.EventManagement.service.interfaces.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // Get All Events
    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllEvents() {
        List<EventDTO> events = eventService.getAllEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    // Get Event by ID
    @GetMapping("/{eventId}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable Long eventId) {
        EventDTO event = eventService.getEventById(eventId);
        return (event != null) ? new ResponseEntity<>(event, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Delete Event
    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Get Upcoming Events
    @GetMapping("/upcoming")
    public ResponseEntity<List<EventDTO>> getUpcomingEvents() {
        List<EventDTO> upcomingEvents = eventService.getUpcomingEvents();
        return new ResponseEntity<>(upcomingEvents, HttpStatus.OK);
    }

    // Get Public Upcoming Events
    @GetMapping("/public-upcoming")
    public ResponseEntity<List<EventDTO>> getPublicUpcomingEvents() {
        List<EventDTO> publicUpcomingEvents = eventService.getPublicUpcomingEvents();
        return new ResponseEntity<>(publicUpcomingEvents, HttpStatus.OK);
    }

    // Get Events by Group (Optional)
    //@GetMapping("/group/{groupName}")
    //public ResponseEntity<List<EventDTO>> getEventsByGroup(@PathVariable String groupName) {
       // List<EventDTO> events = eventService.getEventsByGroup(groupName);
       // return new ResponseEntity<>(events, HttpStatus.OK);
    //}
}
