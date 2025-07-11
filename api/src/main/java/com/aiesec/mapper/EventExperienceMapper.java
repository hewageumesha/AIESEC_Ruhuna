package com.aiesec.mapper;


import com.aiesec.dto.EventExperienceDTO; 
import com.aiesec.model.event.Event; 
import com.aiesec.model.event.GuestUser; 
import com.aiesec.model.User;
import com.aiesec.model.event.EventExperience;

public class EventExperienceMapper {

    public static EventExperienceDTO toDTO(EventExperience experience) {
        return EventExperienceDTO.builder()
                .experienceId(experience.getExperienceId())
                .eventId(experience.getEvent().getEventId())
                .userId(Long.valueOf(experience.getUser() != null ? experience.getUser().getId() : null))
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
            user.setId((long) Math.toIntExact(dto.getUserId()));
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
