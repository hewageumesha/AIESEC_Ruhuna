package com.aiesec.service.impl;

import com.aiesec.dto.EventDTO;
import com.aiesec.model.event.Event;
import com.aiesec.mapper.EventMapper;
import com.aiesec.repository.event.EventRepository;
import com.aiesec.service.interfaces.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventServiceimpl implements EventService {

    private final EventRepository eventRepository;

    @Autowired
    public EventServiceimpl(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }
    @Override
    public EventDTO createEvent(EventDTO eventDTO) {
        Event event = EventMapper.toEntity(eventDTO);

        // Handle null value for hasTshirtOrder (if EventDTO uses Boolean)
        if (eventDTO.getHasTshirtOrder() == null) {
            event.setHasTshirtOrder(false); // default to false
        } else {
            event.setHasTshirtOrder(eventDTO.getHasTshirtOrder());
        }

        // Handle null or empty visibility
        if (eventDTO.getVisibility() == null || eventDTO.getVisibility().isEmpty()) {
            event.setVisibility("Private"); // default visibility
        } else {
            event.setVisibility(eventDTO.getVisibility());
        }

        return EventMapper.toDTO(eventRepository.save(event));
    }


    @Override
    public EventDTO updateEvent(Long eventId, EventDTO updatedEvent) {
        Optional<Event> existing = eventRepository.findById(eventId);
        if (existing.isPresent()) {
            Event event = existing.get();
            event.setEventName(updatedEvent.getEventName());
            event.setDescription(updatedEvent.getDescription());
            event.setStartDate(updatedEvent.getStartDate());
            event.setEventTime(updatedEvent.getEventTime());
            event.setEndDate(updatedEvent.getEndDate());
            event.setEndTime(updatedEvent.getEndTime());
            event.setLocation(updatedEvent.getLocation());
            event.setImageUrl(updatedEvent.getImageUrl());
            event.setIsPublic(updatedEvent.getIsPublic());
            event.setIsVirtual(updatedEvent.getIsVirtual());
            event.setVirtualLink(updatedEvent.getVirtualLink());

            return EventMapper.toDTO(eventRepository.save(event));
        }
        return null;
    }

    @Override
    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(EventMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EventDTO getEventById(Long id) {
        return eventRepository.findById(id)
                .map(EventMapper::toDTO)
                .orElse(null);
    }

    @Override
    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }

    @Override
    public List<EventDTO> getUpcomingEvents() {
        LocalDate now = LocalDate.now();
        return eventRepository.findByStartDateAfter(now)
                .stream()
                .map(EventMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventDTO> getPublicUpcomingEvents() {
        LocalDate now = LocalDate.now();
        return eventRepository.findByIsPublicTrueAndStartDateAfter(now)
                .stream()
                .map(EventMapper::toDTO)
                .collect(Collectors.toList());
    }
    @Override
    public void updateTshirtOrder(Long eventId, Boolean hasTshirtOrder) {
        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if (optionalEvent.isPresent()) {
            Event event = optionalEvent.get();
            event.setHasTshirtOrder(Boolean.TRUE.equals(hasTshirtOrder));
            eventRepository.save(event);
        } else {
            throw new RuntimeException("Event not found with ID: " + eventId);
        }
    }

    @Override
    public void updateEventVisibility(Long eventId, String visibility) {
        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if (optionalEvent.isPresent()) {
            Event event = optionalEvent.get();
            event.setVisibility(visibility != null && !visibility.isEmpty() ? visibility : "Private");
            eventRepository.save(event);
        } else {
            throw new RuntimeException("Event not found with ID: " + eventId);
        }
    }



    //@Override
    //public List<EventDTO> getEventsByGroup(String groupName) {
        //return List.of(); // Dummy return for now
    //}
}

