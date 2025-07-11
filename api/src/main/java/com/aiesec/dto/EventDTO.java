package com.aiesec.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

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

    @JsonFormat(pattern = "hh:mm a") // Accepts format like "03:30 PM"
    private LocalTime eventTime;

    @JsonFormat(pattern = "hh:mm a")
    private LocalTime endTime;

    private LocalDate endDate;
    private String location;
    private String imageUrl;
    private Boolean isPublic;
    private Boolean isVirtual;
    private String virtualLink;
    private Boolean hasMerchandise;
    private List<MerchandiseDTO> merchandise;
}
