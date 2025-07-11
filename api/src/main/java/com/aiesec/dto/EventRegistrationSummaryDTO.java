package com.aiesec.dto;

import lombok.Data;

@Data
public class EventRegistrationSummaryDTO {
    private Long eventId;
    private String eventName;
    //private Long totalRegistrations;
   private Long goingCount;
   // private Long pendingCount;
   // private Long notGoingCount;
   // private Long memberCount;
   // private Long guestCount;


    public EventRegistrationSummaryDTO(Long eventId, String eventName, Long goingCount) {
        this.eventId = eventId;
        this.eventName = eventName;
        this.goingCount = goingCount;
    }
}
