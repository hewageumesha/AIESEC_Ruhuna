package com.aiesec.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class EventDTO {
    private Long eventId;
    private String eventName;
    private String description;
    private LocalDate startDate;
    private LocalTime eventTime;
    private LocalTime endTime;
    private LocalDate endDate;
    private String location;
    private String imageUrl;
    private Boolean isPublic;
    private Boolean isVirtual;
    private String virtualLink;
}
