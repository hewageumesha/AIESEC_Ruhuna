package com.aiesec.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class RegistrationAnalyticsDTO {
    private Long eventId;
    private String eventName;
    private LocalDate eventDate;
    private int memberRegistrations;
    private int guestRegistrations;

}
