package com.example.EventManagement.mapper;
import com.example.EventManagement.dto.GalleryDTO;
import com.example.EventManagement.entity.Event;
import com.example.EventManagement.entity.EventGallery;

import java.time.LocalDateTime;

public class GalleryMapper {

    public static GalleryDTO toDTO(EventGallery gallery) {
        return
                GalleryDTO.builder()
                .galleryId(gallery.getGalleryId())
                .imageUrl(gallery.getImageUrl())
                .caption(gallery.getCaption())
                .eventId(gallery.getEvent() != null ? gallery.getEvent().getEventId() : null)
                .uploadedAt(gallery.getUploadedAt())
                .build();
    }

    public static EventGallery toEntity(GalleryDTO dto, Event event) {
        return EventGallery.builder()
                .galleryId(dto.getGalleryId())
                .imageUrl(dto.getImageUrl())
                .caption(dto.getCaption())
                .event(event)
                .uploadedAt(LocalDateTime.now())
                .build();
    }
}
