package com.aiesec.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventExperienceDTO {
    private Long experienceId;
    private Long eventId;
    private Long userId; //AIESEC Member
    private Long guestUserId;  //Guest
    private Integer rating;
    private String testimonial;
    private LocalDate dateCreated;
}
