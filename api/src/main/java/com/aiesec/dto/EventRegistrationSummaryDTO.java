package com.aiesec.dto;

import lombok.Data;

@Data
public class EventRegistrationSummaryDTO {
    private Long eventId;
    private String eventName;
    private Long totalRegistrations;
    private Long goingCount;
    private Long pendingCount;
    private Long notGoingCount;
    private Long memberCount;
    private Long guestCount;


    public EventRegistrationSummaryDTO(Long eventId, String eventName, Long totalRegistrations,
                                       Long goingCount, Long pendingCount, Long notGoingCount,
                                       Long memberCount, Long guestCount) {
        this.eventId = eventId;
        this.eventName = eventName;
        this.totalRegistrations = totalRegistrations;
        this.goingCount = goingCount;
        this.pendingCount = pendingCount;
        this.notGoingCount = notGoingCount;
        this.memberCount = memberCount;
        this.guestCount = guestCount;
    }
}
