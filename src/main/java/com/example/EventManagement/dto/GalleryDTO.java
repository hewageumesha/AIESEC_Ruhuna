package com.example.EventManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GalleryDTO {
    private Long galleryId;
    private Long eventId;
    private String imageUrl;
    private String caption;
    private LocalDateTime uploadedAt;
}
