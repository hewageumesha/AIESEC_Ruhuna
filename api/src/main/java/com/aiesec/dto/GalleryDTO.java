package com.aiesec.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GalleryDTO {
    private Long galleryId;
    private String imageUrl;
    private String storagePath;
    private LocalDateTime uploadedAt;

    // For version-based uploads (annual events)
    private Long eventVersionId;
    private String versionName;
    private LocalDateTime eventDate;
    private String versionDescription;

    // For direct category uploads (one-time events)
    private Long categoryId;
    private String categoryName;
    private Boolean isAnnual;

    // Helper methods
    public boolean isVersionBased() {
        return eventVersionId != null;
    }

    public boolean isCategoryBased() {
        return categoryId != null && eventVersionId == null;
    }

    public boolean isOneTimeEvent() {
        return isAnnual != null && !isAnnual;
    }

    public boolean isAnnualEvent() {
        return isAnnual != null && isAnnual;
    }
}