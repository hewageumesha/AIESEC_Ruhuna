package com.aiesec.dto;

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
    private String imageUrl;
    private String category;
    private String storagePath;
    private LocalDateTime uploadedAt;

}
