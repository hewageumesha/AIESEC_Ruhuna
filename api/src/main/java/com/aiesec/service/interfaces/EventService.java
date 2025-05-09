package com.aiesec.service.interfaces;


import com.aiesec.dto.EventDTO;
import com.aiesec.model.event.Event;
import java.util.List;

public interface EventService {
    // Create new event
    EventDTO createEvent(EventDTO eventDTO);

    // Update existing event
    EventDTO updateEvent(Long eventId, EventDTO eventDTO);

    // Get event by ID
    EventDTO getEventById(Long eventId);

    // Get all events
    List<EventDTO> getAllEvents();

    // Delete event by ID
    void deleteEvent(Long eventId);

    // Method to update the T-shirt order availability (hasTshirtOrder)
    void updateTshirtOrder(Long eventId, boolean hasTshirtOrder);

    // Method to update visibility (Public or Private)
    void updateEventVisibility(Long eventId, String visibility);
}
