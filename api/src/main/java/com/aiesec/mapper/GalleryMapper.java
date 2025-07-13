package com.aiesec.mapper;


import com.aiesec.dto.GalleryDTO;
import com.aiesec.model.event.Event;
import com.aiesec.model.event.EventGallery;

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

