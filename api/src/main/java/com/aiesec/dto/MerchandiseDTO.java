package com.aiesec.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MerchandiseDTO {
    private Long merchandiseId;
    private Long eventId;
    private String type;
    private String description;
    private List<String> images;
    private boolean available;
}
