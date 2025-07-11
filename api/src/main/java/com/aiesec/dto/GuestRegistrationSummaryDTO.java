package com.aiesec.dto;


import lombok.Data;



@Data

public class GuestRegistrationSummaryDTO {
    private Long eventId;
    private String eventName;
   // private Long totalRegistrations;
    private Long goingCount;

    public GuestRegistrationSummaryDTO(Long eventId, String eventName, Long goingCount) {
        this.eventId = eventId;
        this.eventName = eventName;
        this.goingCount = goingCount;
    }
}
