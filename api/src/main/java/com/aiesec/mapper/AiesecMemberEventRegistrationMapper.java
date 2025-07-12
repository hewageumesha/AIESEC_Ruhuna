package com.aiesec.mapper;

import com.aiesec.dto.AiesecMemberEventRegistrationDTO;
import com.aiesec.dto.UserDTO;
import com.aiesec.model.User;
import com.aiesec.model.event.AiesecMemberEventRegistration;
import com.aiesec.model.event.Event;

public class AiesecMemberEventRegistrationMapper {

    public static AiesecMemberEventRegistrationDTO toDTO(AiesecMemberEventRegistration entity) {
        if (entity == null) return null;

        AiesecMemberEventRegistrationDTO dto = new AiesecMemberEventRegistrationDTO();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUserId());
        dto.setEventId(entity.getEventId());
        dto.setInterestStatus(entity.getInterestStatus());
        dto.setComment(entity.getComment());
        dto.setRegisteredAt(entity.getRegisteredAt());

        // Minimal user mapping (only what's needed in the table)
        User user = entity.getUser();
        if (user != null) {
            UserDTO userDTO = new UserDTO();
            userDTO.setFirstName(user.getFirstName());
            userDTO.setLastName(user.getLastName());
            userDTO.setAiesecEmail(user.getAiesecEmail());
            dto.setUser(userDTO);
        }

        return dto;
    }

    public static AiesecMemberEventRegistration toEntity(AiesecMemberEventRegistrationDTO dto) {
        if (dto == null) return null;

        AiesecMemberEventRegistration entity = new AiesecMemberEventRegistration();
        entity.setId(dto.getId());
        entity.setUserId(dto.getUserId());
        entity.setEventId(dto.getEventId());
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
