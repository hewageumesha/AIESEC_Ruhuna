package com.aiesec.mapper;

import com.aiesec.dto.EventDTO;
import com.aiesec.model.event.Event;
import com.aiesec.model.event.Merchandise;

import java.util.List;
import java.util.stream.Collectors;

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
                .merchandise(
                        event.getMerchandiseList() != null ?
                                event.getMerchandiseList().stream()
                                        .map(MerchandiseMapper::toDTO)
                                        .collect(Collectors.toList())
                                : null
                )
                .build();
    }

    public static Event toEntity(EventDTO dto) {
        Event event = Event.builder()
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
                .hasMerchandise(false) // default
                .build();

        // Attach merchandise if present
        if (dto.getMerchandise() != null && !dto.getMerchandise().isEmpty()) {
            List<Merchandise> merchandiseList = dto.getMerchandise().stream()
                    .map(m -> MerchandiseMapper.toEntity(m, event))  // Link each to the parent event
                    .collect(Collectors.toList());

            event.setMerchandiseList(merchandiseList);
            event.setHasMerchandise(true);
        }

        return event;
    }
}
