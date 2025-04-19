package com.example.EventManagement.mapper;

import com.example.EventManagement.dto.EventExperienceDTO;
import com.example.EventManagement.entity.EventExperience;
import com.example.EventManagement.entity.Event;
import com.example.EventManagement.entity.User;
import com.example.EventManagement.entity.GuestUser;

public class EventExperienceMapper {

    public static EventExperienceDTO toDTO(EventExperience experience) {
        return EventExperienceDTO.builder()
                .experienceId(experience.getExperienceId())
                .eventId(experience.getEvent().getEventId())
                .userId(experience.getUser() != null ? experience.getUser().getUserId() : null)
                .guestUserId(experience.getGuestUser() != null ? experience.getGuestUser().getGuestUserId() : null)
                .rating(experience.getRating())
                .testimonial(experience.getTestimonial())
                // .dateCreated(experience.getDateCreated()) // Uncomment if needed
                .build();
    }

    public static EventExperience toEntity(EventExperienceDTO dto) {
        EventExperience experience = new EventExperience();
        experience.setExperienceId(dto.getExperienceId());

        // Set Event
        Event event = new Event();
        event.setEventId(dto.getEventId());
        experience.setEvent(event);

        // Set User
        if (dto.getUserId() != null) {
            User user = new User();
            user.setUserId(dto.getUserId());
            experience.setUser(user);
        }

        // Set GuestUser
        if (dto.getGuestUserId() != null) {
            GuestUser guestUser = new GuestUser();
            guestUser.setGuestUserId(dto.getGuestUserId());
            experience.setGuestUser(guestUser);
        }

        experience.setRating(dto.getRating());
        experience.setTestimonial(dto.getTestimonial());
        // experience.setDateCreated(dto.getDateCreated()); // Uncomment if needed

        return experience;
    }
}
