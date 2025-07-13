package com.aiesec.mapper;

import com.aiesec.dto.GuestEventRegistrationDTO;
import com.aiesec.model.event.GuestEventRegistration;

public class GuestEventRegistrationMapper {

    public static GuestEventRegistrationDTO toDTO(GuestEventRegistration entity) {
        if (entity == null) return null;

        GuestEventRegistrationDTO dto = new GuestEventRegistrationDTO();
        dto.setGuestUserId(entity.getGuestUserId());
        dto.setEventId(entity.getEvent() != null ? entity.getEvent().getEventId() : null);
        dto.setName(entity.getName());
        dto.setEmail(entity.getEmail());
        dto.setPhone(entity.getPhone());
        dto.setInterestStatus(entity.getInterestStatus());
        dto.setComment(entity.getComment());
        dto.setRegisteredAt(entity.getRegisteredAt());

        return dto;
    }

    public static GuestEventRegistration toEntity(GuestEventRegistrationDTO dto) {
        if (dto == null) return null;

        GuestEventRegistration entity = new GuestEventRegistration();
        entity.setGuestUserId(dto.getGuestUserId());
        entity.setName(dto.getName());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setInterestStatus(dto.getInterestStatus());
        entity.setComment(dto.getComment());
        entity.setRegisteredAt(dto.getRegisteredAt());

        if (dto.getEventId() != null) {
            Event event = new Event();
            event.setEventId(dto.getEventId());
            entity.setEvent(event);
        }

        return entity;
    }
}
