package com.aiesec.mapper;

import com.aiesec.dto.AiesecMemberEventRegistrationDTO;
import com.aiesec.model.event.AiesecMemberEventRegistration;
import com.aiesec.model.event.Event;

import java.time.LocalDateTime;

public class AiesecMemberEventRegistrationMapper {

    public static AiesecMemberEventRegistration toEntity(AiesecMemberEventRegistrationDTO dto) {
        if (dto == null) return null;

        AiesecMemberEventRegistration entity = new AiesecMemberEventRegistration();
        entity.setId(dto.getId());
        entity.setUserId(dto.getUserId());
        if (dto.getEventId() != null) {
            Event event = new Event();
            event.setEventId(dto.getEventId());
            entity.setEvent(event); // ✅ not setEventId()
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
                .eventId(entity.getEvent() != null ? entity.getEvent().getEventId() : null)
                .interestStatus(entity.getInterestStatus())
                .comment(entity.getComment())
                .registeredAt(entity.getRegisteredAt())
                .build();
    }
}
