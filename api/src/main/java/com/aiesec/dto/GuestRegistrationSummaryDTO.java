package com.aiesec.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GuestRegistrationSummaryDTO {
    private Long eventId;
    private String eventName;
    private Long totalRegistrations;
    private Long goingCount;
    private Long pendingCount;
    private Long notGoingCount;
}
