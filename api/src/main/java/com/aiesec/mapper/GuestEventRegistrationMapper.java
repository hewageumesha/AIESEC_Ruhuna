package com.aiesec.mapper;

import com.aiesec.dto.GuestEventRegistrationDTO;
import com.aiesec.model.event.Event;
import com.aiesec.model.event.GuestEventRegistration;

import java.time.LocalDateTime;

public class GuestEventRegistrationMapper {

    public static GuestEventRegistration toEntity(GuestEventRegistrationDTO dto) {
        if (dto == null) return null;

        // Build Event reference with only ID to avoid loading full object
        Event event = new Event();
        event.setEventId(dto.getEventId());

        return GuestEventRegistration.builder()
                .guestUserId(dto.getGuestUserId())
                .event(event)  // associate the event object
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .interestStatus(dto.getInterestStatus())
                .comment(dto.getComment())
                .registeredAt(dto.getRegisteredAt() != null ? dto.getRegisteredAt() : LocalDateTime.now())
                .build();
    }

    public static GuestEventRegistrationDTO toDTO(GuestEventRegistration entity) {
        if (entity == null) return null;

        return GuestEventRegistrationDTO.builder()
                .guestUserId(entity.getGuestUserId())
                .eventId(entity.getEvent() != null ? entity.getEvent().getEventId() : null)
                .eventName(entity.getEvent() != null ? entity.getEvent().getEventName() : null)
                .name(entity.getName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .interestStatus(entity.getInterestStatus())
                .comment(entity.getComment())
                .registeredAt(entity.getRegisteredAt())
                .build();
    }
}
