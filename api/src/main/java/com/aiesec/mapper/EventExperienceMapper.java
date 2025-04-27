package com.aiesec.mapper;

import com.aiesec.dto.EventExperienceDTO;
import com.aiesec.model.User;
import com.aiesec.model.event.Event;
import com.aiesec.model.event.EventExperience;
import com.aiesec.model.event.GuestUser;

public class EventExperienceMapper {
/*
    // Convert Entity -> DTO
    public static EventExperienceDTO toDTO(EventExperience experience) {
        if (experience == null) {
            return null;
        }

        EventExperienceDTO dto = new EventExperienceDTO();
        dto.setExperienceId(experience.getExperienceId());

        if (experience.getEvent() != null) {
            dto.setEventId(experience.getEvent().getEventId());
        }

        if (experience.getUser() != null) {
            dto.setUserId(experience.getUser().getId());
        }

        if (experience.getGuestUser() != null) {
            dto.setGuestUserId(experience.getGuestUser().getGuestUserId());
        }

        dto.setRating(experience.getRating());
        dto.setTestimonial(experience.getTestimonial());
        // dto.setDateCreated(experience.getDateCreated());  // Uncomment if you add dateCreated later

        return dto;
    }

    // Convert DTO -> Entity
    public static EventExperience toEntity(EventExperienceDTO dto) {
        if (dto == null) {
            return null;
        }

        EventExperience experience = new EventExperience();
        experience.setExperienceId(dto.getExperienceId());

        if (dto.getEventId() != null) {
            Event event = new Event();
            event.setEventId(dto.getEventId());
            experience.setEvent(event);
        }

        if (dto.getUserId() != null) {
            User user = new User();
            user.setId(dto.getUserId());
            experience.setUser(user);
        }

        if (dto.getGuestUserId() != null) {
            GuestUser guestUser = new GuestUser();
            guestUser.setGuestUserId(dto.getGuestUserId());
            experience.setGuestUser(guestUser);
        }

        experience.setRating(dto.getRating());
        experience.setTestimonial(dto.getTestimonial());
        // experience.setDateCreated(dto.getDateCreated());  // Uncomment if you add dateCreated later

        return experience;

    }*/
}
