package com.aiesec.service.interfaces;


import com.aiesec.dto.EventDTO;
import com.aiesec.model.event.Event;
import org.springframework.data.domain.Page;

import java.awt.print.Pageable;
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
    void updateTshirtOrder(Long eventId, Boolean hasTshirtOrder);

    List<EventDTO> getUpcomingEvents();

    List<EventDTO> getPublicUpcomingEvents();
    // Add these new methods
    List<EventDTO> getPrivateUpcomingEvents();

    List<EventDTO> getAllPublicEvents();

    List<EventDTO> getAllPrivateEvents();

    // Search event
    Page<EventDTO> filterEvents(String search, String status, String date, Pageable pageable);
}
