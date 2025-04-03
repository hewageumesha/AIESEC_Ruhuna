package com.example.EventManagement.service.impl;

import com.example.EventManagement.entity.Event;
import com.example.EventManagement.repository.EventRepository;
import com.example.EventManagement.service.EventService;
import com.example.EventManagement.exception.EventNotFoundException; // Custom Exception
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class EventServiceImpl implements EventService {

    private static final Logger logger = LoggerFactory.getLogger(EventServiceImpl.class);

    private final EventRepository eventRepository;

    @Autowired
    public EventServiceImpl(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Override
    public Event createEvent(Event event) {
        logger.info("Creating new event: {}", event.getEventName());
        return eventRepository.save(event);
    }

    @Transactional
    @Override
    public Event updateEvent(Long eventId, Event eventDetails) {
        logger.info("Updating event with ID: {}", eventId);

        Optional<Event> existingEventOpt = eventRepository.findById(eventId);
        if (existingEventOpt.isPresent()) {
            Event existingEvent = existingEventOpt.get();

            // Update event properties
            existingEvent.setEventName(eventDetails.getEventName());
            existingEvent.setDescription(eventDetails.getDescription());
            existingEvent.setStartDate(eventDetails.getStartDate());
            existingEvent.setEndDate(eventDetails.getEndDate());
            existingEvent.setEventTime(eventDetails.getEventTime());
            existingEvent.setLocation(eventDetails.getLocation());
            existingEvent.setEventPhoto(eventDetails.getEventPhoto());

            // Save and return the updated event
            logger.info("Event updated successfully: {}", eventId);
            return eventRepository.save(existingEvent);
        } else {
            logger.error("Event not found with ID: {}", eventId);
            throw new EventNotFoundException("Event not found with ID: " + eventId);
        }
    }

    @Override
    public void deleteEvent(Long eventId) {
        logger.info("Deleting event with ID: {}", eventId);
        eventRepository.deleteById(eventId);
    }

    @Override
    public List<Event> getAllEvents() {
        logger.info("Fetching all events");
        return eventRepository.findAll();
    }

    @Override
    public Optional<Event> getEventById(Long eventId) {
        logger.info("Fetching event with ID: {}", eventId);
        return eventRepository.findById(eventId);
    }
}
