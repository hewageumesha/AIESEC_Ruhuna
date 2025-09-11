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

        // CRITICAL FIX: Properly map user with phone number
        User user = entity.getUser();
        if (user != null) {
            UserDTO userDTO = new UserDTO();
            userDTO.setId(user.getId());
            userDTO.setFirstName(user.getFirstName());
            userDTO.setLastName(user.getLastName());
            userDTO.setEmail(user.getEmail());
            userDTO.setAiesecEmail(user.getAiesecEmail());

            // FIXED: Only use phoneNumber field since phone field doesn't exist in User entity
            String phoneNumber = user.getPhoneNumber();

            // userDTO.setPhoneNumber(phoneNumber);
            userDTO.setPhone(phoneNumber); // Set both fields to the same value for compatibility

            // Debug logging to check if phone is being mapped
            System.out.println("Mapping phone for user " + user.getId() + ": phoneNumber=" + phoneNumber);

            dto.setUser(userDTO);
        } else {
            System.out.println("WARNING: User is null for registration " + entity.getId());
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