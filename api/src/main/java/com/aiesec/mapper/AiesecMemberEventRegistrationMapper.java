package com.aiesec.mapper;

import com.aiesec.dto.AiesecMemberEventRegistrationDTO;
import com.aiesec.model.event.AiesecMemberEventRegistration;

import java.time.LocalDateTime;

public class AiesecMemberEventRegistrationMapper {

    public static AiesecMemberEventRegistration toEntity(AiesecMemberEventRegistrationDTO dto) {
        if (dto == null) return null;

        AiesecMemberEventRegistration entity = new AiesecMemberEventRegistration();
        entity.setId(dto.getId());

        // ✅ Set primitive foreign keys directly
        entity.setUserId(dto.getUserId());
        entity.setEventId(dto.getEventId());

        // Optional: set full Event object for lazy loading if needed
        if (dto.getEventId() != null) {
            Event event = new Event();
            event.setEventId(dto.getEventId());
            entity.setEvent(event);
        }

        entity.setInterestStatus(dto.getInterestStatus());
        entity.setComment(dto.getComment());
        entity.setRegisteredAt(dto.getRegisteredAt() != null ? dto.getRegisteredAt() : LocalDateTime.now());

        return entity;
    }

    public static AiesecMemberEventRegistrationDTO toDTO(AiesecMemberEventRegistration entity) {
        if (entity == null) return null;

        return AiesecMemberEventRegistrationDTO.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .eventId(entity.getEventId()) // ✅ Directly from primitive field
                .interestStatus(entity.getInterestStatus())
                .comment(entity.getComment())
                .registeredAt(entity.getRegisteredAt())
                .build();
    }
}
