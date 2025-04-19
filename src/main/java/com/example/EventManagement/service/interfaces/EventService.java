package com.example.EventManagement.service.interfaces;

import com.example.EventManagement.dto.EventDTO;
import java.util.List;

public interface EventService {

    EventDTO createEvent(EventDTO eventDTO);

    EventDTO updateEvent(Long eventId, EventDTO eventDTO);

    void deleteEvent(Long eventId);

    EventDTO getEventById(Long eventId);

    List<EventDTO> getAllEvents();

    List<EventDTO> getUpcomingEvents();

   // List<EventDTO> getEventsByOrganizer(Long userId);

    //List<EventDTO> getEventsByType(String type); // Optional if you categorize events

   // List<EventDTO> searchEvents(String keyword); // For filter/search functionality

    List<EventDTO> getPublicUpcomingEvents();

   // List<EventDTO> getEventsByGroup(String groupName);
}