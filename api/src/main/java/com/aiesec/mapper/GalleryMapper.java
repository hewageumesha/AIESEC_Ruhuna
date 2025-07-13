package com.aiesec.mapper;

import com.aiesec.dto.GalleryDTO;
import com.aiesec.model.event.EventGallery;

import java.time.LocalDateTime;

public class GalleryMapper {

    public static GalleryDTO toDTO(EventGallery gallery) {
        return GalleryDTO.builder()
                .galleryId(gallery.getGalleryId())
                .imageUrl(gallery.getImageUrl())
                .category(gallery.getCategory())
                .storagePath(gallery.getStoragePath())
                .uploadedAt(gallery.getUploadedAt())
                .build();
    }

    public static EventGallery toEntity(GalleryDTO dto) {
        return EventGallery.builder()
                .galleryId(dto.getGalleryId())
                .imageUrl(dto.getImageUrl())
                .category(dto.getCategory())
                .uploadedAt(LocalDateTime.now())
                .storagePath(dto.getStoragePath())
                .build();
    }
}
