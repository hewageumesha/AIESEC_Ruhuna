package com.aiesec.dto;

import lombok.Data;

@Data
public class EventRegistrationSummaryDTO {
    private Long eventId;
    private String eventName;
  
   private Long goingCount;
  


    public EventRegistrationSummaryDTO(Long eventId, String eventName, Long goingCount) {
        this.eventId = eventId;
        this.eventName = eventName;
        this.goingCount = goingCount;
    }
}
