package com.example.EventManagement.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class EventDTO {
    private Long eventId;
    private String eventName;
    private String descriptions;
    private LocalDate startDate;
    private LocalTime eventTime;
    private String location;
    private String imageUrl;
    private Boolean isPublic;
}
