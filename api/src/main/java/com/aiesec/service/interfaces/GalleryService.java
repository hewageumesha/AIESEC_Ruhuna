package com.aiesec.service.interfaces;

import com.aiesec.dto.GalleryDTO;

import java.util.List;

public interface GalleryService {

    GalleryDTO uploadGalleryImage(GalleryDTO dto);
    List<GalleryDTO> getAllGalleryImages();
    List<GalleryDTO> getGalleryImagesByEventId(Long eventId);
    void deleteGalleryImage(Long id);
}

