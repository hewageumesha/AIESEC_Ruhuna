package com.aiesec.mapper;

import com.aiesec.dto.GuestEventRegistrationDTO;
import com.aiesec.model.event.GuestEventRegistration;

import java.time.LocalDateTime;

public class GuestEventRegistrationMapper {

    public static GuestEventRegistration toEntity(GuestEventRegistrationDTO dto) {
        if (dto == null) return null;

        return GuestEventRegistration.builder()
                .guestUserId(dto.getGuestUserId())
                .eventId(dto.getEventId())
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
                .eventId(entity.getEventId())
                .name(entity.getName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .interestStatus(entity.getInterestStatus())
                .comment(entity.getComment())
                .registeredAt(entity.getRegisteredAt())
                .build();
    }
}
