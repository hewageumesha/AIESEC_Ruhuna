package com.aiesec.mapper;

import com.aiesec.dto.GalleryDTO;
import com.aiesec.model.event.EventGallery;
import com.aiesec.model.event.EventVersion;
import com.aiesec.model.event.EventCategory;

import java.time.LocalDateTime;

public class GalleryMapper {

    /**
     * Convert EventGallery entity to GalleryDTO
     * Handles both version-based (annual events) and direct category (one-time events) uploads
     */
    public static GalleryDTO toDTO(EventGallery gallery) {
        GalleryDTO.GalleryDTOBuilder builder = GalleryDTO.builder()
                .galleryId(gallery.getGalleryId())
                .imageUrl(gallery.getImageUrl())
                .storagePath(gallery.getStoragePath())
                .uploadedAt(gallery.getUploadedAt());

        // If image belongs to a version (annual event)
        if (gallery.getEventVersion() != null) {
            EventVersion version = gallery.getEventVersion();
            builder.eventVersionId(version.getId())
                    .versionName(version.getVersionName())
                    .eventDate(version.getEventDate())
                    .versionDescription(version.getDescription());

            // Also include category info from the version
            if (version.getEventCategory() != null) {
                EventCategory category = version.getEventCategory();
                builder.categoryId(category.getId())
                        .categoryName(category.getCategoryName())
                        .isAnnual(category.getIsAnnual());
            }
        }
        // If image belongs directly to category (one-time event)
        else if (gallery.getCategory() != null) {
            EventCategory category = gallery.getCategory();
            builder.categoryId(category.getId())
                    .categoryName(category.getCategoryName())
                    .isAnnual(category.getIsAnnual());

            // No version info for one-time events
            builder.eventVersionId(null)
                    .versionName(null)
                    .eventDate(null)
                    .versionDescription(null);
        }

        return builder.build();
    }

    /**
     * Convert GalleryDTO to EventGallery entity for version-based upload (annual events)
     */
    public static EventGallery toEntity(GalleryDTO dto, EventVersion eventVersion) {
        return EventGallery.builder()
                .galleryId(dto.getGalleryId())
                .imageUrl(dto.getImageUrl())
                .storagePath(dto.getStoragePath())
                .uploadedAt(dto.getUploadedAt() != null ? dto.getUploadedAt() : LocalDateTime.now())
                .eventVersion(eventVersion)
                .category(null) // For version-based uploads, category should be null
                .build();
    }

    /**
     * Convert GalleryDTO to EventGallery entity for direct category upload (one-time events)
     */
    public static EventGallery toEntity(GalleryDTO dto, EventCategory category) {
        return EventGallery.builder()
                .galleryId(dto.getGalleryId())
                .imageUrl(dto.getImageUrl())
                .storagePath(dto.getStoragePath())
                .uploadedAt(dto.getUploadedAt() != null ? dto.getUploadedAt() : LocalDateTime.now())
                .eventVersion(null) // For direct category uploads, eventVersion should be null
                .category(category)
                .build();
    }

    /**
     * Create EventGallery entity from basic info for version-based upload
     */
    public static EventGallery createForVersion(String imageUrl, String storagePath, EventVersion eventVersion) {
        return EventGallery.builder()
                .imageUrl(imageUrl)
                .storagePath(storagePath)
                .uploadedAt(LocalDateTime.now())
                .eventVersion(eventVersion)
                .category(null)
                .build();
    }

    /**
     * Create EventGallery entity from basic info for direct category upload
     */
    public static EventGallery createForCategory(String imageUrl, String storagePath, EventCategory category) {
        return EventGallery.builder()
                .imageUrl(imageUrl)
                .storagePath(storagePath)
                .uploadedAt(LocalDateTime.now())
                .eventVersion(null)
                .category(category)
                .build();
    }
}