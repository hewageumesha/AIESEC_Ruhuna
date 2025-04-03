package com.example.EventManagement.service;
import com.example.EventManagement.entity.Event;
import java.util.List;
import java.util.Optional;


public interface EventService {
    Event createEvent(Event event);
    Event updateEvent(Long eventId, Event event);
    void deleteEvent(Long eventId);
    List<Event> getAllEvents();
    Optional<Event> getEventById(Long eventId);
}
