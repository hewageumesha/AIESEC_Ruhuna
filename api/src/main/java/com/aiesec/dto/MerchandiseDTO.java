package com.aiesec.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MerchandiseDTO {

    private Long id;
    private boolean available;
    private String description;
    private List<String> imageUrls;
    private Long eventId; // Link to the event
}
