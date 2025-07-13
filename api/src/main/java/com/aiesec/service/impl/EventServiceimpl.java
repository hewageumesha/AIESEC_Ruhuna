package com.aiesec.service.impl;

import com.aiesec.dto.EventDTO;
import com.aiesec.mapper.EventMapper;
import com.aiesec.mapper.MerchandiseMapper;
import com.aiesec.model.event.Event;
import com.aiesec.model.event.Merchandise;
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
        // Convert DTO to Entity
        Event event = EventMapper.toEntity(eventDTO);

        // Set isPublic with fallback to false
        event.setIsPublic(Boolean.TRUE.equals(eventDTO.getIsPublic()));

        // Check and attach merchandise
        if (eventDTO.getMerchandise() != null && !eventDTO.getMerchandise().isEmpty()) {
            List<Merchandise> merchList = eventDTO.getMerchandise().stream()
                    .map(dto -> MerchandiseMapper.toEntity(dto, event)) // link unsaved event
                    .collect(Collectors.toList());

            event.setMerchandiseList(merchList);
            event.setHasMerchandise(true);
        } else {
            event.setHasMerchandise(false);
        }

        // Save event — merchandise list is saved via CascadeType.ALL
        Event savedEvent = eventRepository.save(event);

        // Return mapped DTO
        return EventMapper.toDTO(savedEvent);
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
                        List<Merchandise> merchList = merchandiseRepository.findByEventEventId(id);
                        dto.setMerchandise(
                                merchList.stream()
                                        .map(MerchandiseMapper::toDTO)
                                        .collect(Collectors.toList())
                        );
                    }

                    return dto;
                })
                .orElse(null);
    }



    @Override
    @Transactional
    public void deleteEvent(Long eventId) {
        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if (optionalEvent.isPresent()) {
            eventRepository.delete(optionalEvent.get());
        } else {
            throw new RuntimeException("Event not found with ID: " + eventId);
        }
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
        return eventRepository.findByIsPublicTrueAndStartDateGreaterThanEqual(now)
                .stream()
                .map(EventMapper::toDTO)
                .collect(Collectors.toList());
    }


    @Override
    public List<EventDTO> getPrivateUpcomingEvents() {
        LocalDate now = LocalDate.now();
        return eventRepository.findByIsPublicFalseAndStartDateGreaterThanEqual(now)
                .stream()
                .map(EventMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventDTO> getAllPublicEvents() {
        return eventRepository.findByIsPublicTrue()
                .stream()
                .map(EventMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventDTO> getAllPrivateEvents() {
        return eventRepository.findByIsPublicFalse()
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
    public Page<EventDTO> filterEvents(String search, String status, String dateStr, Pageable pageable) {
        LocalDate date = (dateStr != null && !dateStr.isEmpty()) ? LocalDate.parse(dateStr) : null;
        Page<Event> events = eventRepository.filterEvents(search, status, date, pageable);
        return events.map(EventMapper::toDTO);
    }
}