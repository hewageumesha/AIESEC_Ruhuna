package com.aiesec.service.impl;

import com.aiesec.dto.EventDTO;
import com.aiesec.mapper.EventMapper;
import com.aiesec.mapper.MerchandiseMapper;
import com.aiesec.model.event.Event;
import com.aiesec.repository.event.EventRepository;
import com.aiesec.repository.event.MerchandiseRepository;
import com.aiesec.service.interfaces.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventServiceimpl implements EventService {

    private final EventRepository eventRepository;
    private final MerchandiseRepository merchandiseRepository;

    @Autowired
    public EventServiceimpl(EventRepository eventRepository, MerchandiseRepository merchandiseRepository) {
        this.eventRepository = eventRepository;
        this.merchandiseRepository = merchandiseRepository;
    }

    @Override
    public EventDTO createEvent(EventDTO eventDTO) {
        Event event = EventMapper.toEntity(eventDTO);

        if (eventDTO.getHasMerchandise() == null) {
            event.setHasMerchandise(false);
        } else {
            event.setHasMerchandise(eventDTO.getHasMerchandise());
        }

        if (eventDTO.getVisibility() == null || eventDTO.getVisibility().isEmpty()) {
            event.setVisibility("Private");
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
            event.setHasMerchandise(updatedEvent.getHasMerchandise());
            event.setHasMerchandise(updatedEvent.getHasMerchandise());


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
                .map(event -> {
                    EventDTO dto = EventMapper.toDTO(event);

                    if (Boolean.TRUE.equals(dto.getHasMerchandise())) {
                        merchandiseRepository.findByEventEventId(id).ifPresent(merch -> {
                            dto.setMerchandise(MerchandiseMapper.toDTO(merch));
                        });
                    }

                    return dto;
                })
                .orElse(null);
    }


    @Override
    @Transactional
    public void deleteEvent(Long eventId) {
        // First delete merchandise related to this event
        merchandiseRepository.deleteByEventEventId(eventId);

        // Then delete the event
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
            event.setHasMerchandise(Boolean.TRUE.equals(hasTshirtOrder));
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

    @Override
    public Page<EventDTO> filterEvents(String search, String status, String dateStr, Pageable pageable) {
        LocalDate date = (dateStr != null && !dateStr.isEmpty()) ? LocalDate.parse(dateStr) : null;
        Page<Event> events = eventRepository.filterEvents(search, status, date, pageable);
        return events.map(EventMapper::toDTO);
    }
}
