package com.example.EventManagement.mapper;

import com.example.EventManagement.dto.EventDTO;
import com.example.EventManagement.entity.Event;

public class EventMapper {
    public static EventDTO toDTO(Event event) {
        return EventDTO.builder()
                .eventId(event.getEventId())
                .eventName(event.getEventName())
                .descriptions(event.getDescription())
                .startDate(event.getStartDate())
                .eventTime(event.getEventTime())
                .location(event.getLocation())
                .imageUrl(event.getImageUrl())
                .isPublic(event.getIsPublic())
                .build();
    }

    public static Event toEntity(EventDTO dto) {
       return Event.builder()
               .eventId(dto.getEventId())
               .eventName(dto.getEventName())
               .description(dto.getDescriptions())
               .startDate(dto.getStartDate())
               .eventTime(dto.getEventTime())
               .location(dto.getLocation())
               .imageUrl(dto.getImageUrl())
               .isPublic(dto.getIsPublic())
               .build();


    }
}
