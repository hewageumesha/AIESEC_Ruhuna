package com.aiesec.mapper;

import com.aiesec.dto.EventDTO;
import com.aiesec.model.event.Event;

public class EventMapper {

    public static EventDTO toDTO(Event event) {
        return EventDTO.builder()
                .eventId(event.getEventId())
                .eventName(event.getEventName())
                .description(event.getDescription())
                .startDate(event.getStartDate())
                .eventTime(event.getEventTime())
                .endDate(event.getEndDate())
                .endTime(event.getEndTime())
                .location(event.getLocation())
                .imageUrl(event.getImageUrl())
                .isPublic(event.getIsPublic())
                .isVirtual(event.getIsVirtual())
                .virtualLink(event.getVirtualLink())
                .hasMerchandise(event.getHasMerchandise())
                .visibility(event.getVisibility())
                .build();
    }

    public static Event toEntity(EventDTO dto) {
        return Event.builder()
                .eventId(dto.getEventId())
                .eventName(dto.getEventName())
                .description(dto.getDescription())
                .startDate(dto.getStartDate())
                .eventTime(dto.getEventTime())
                .endDate(dto.getEndDate())
                .endTime(dto.getEndTime())
                .location(dto.getLocation())
                .imageUrl(dto.getImageUrl())
                .isPublic(dto.getIsPublic())
                .isVirtual(dto.getIsVirtual())
                .virtualLink(dto.getVirtualLink())
                .hasMerchandise(dto.getHasMerchandise())
                .visibility(dto.getVisibility())
                .build();
    }
}
