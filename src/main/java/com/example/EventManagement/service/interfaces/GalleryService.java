package com.example.EventManagement.service.interfaces;

import com.example.EventManagement.dto.GalleryDTO;

import java.util.List;

public interface GalleryService {

    GalleryDTO uploadGalleryImage(GalleryDTO dto);
    List<GalleryDTO> getAllGalleryImages();
    List<GalleryDTO> getGalleryImagesByEventId(Long eventId);
    void deleteGalleryImage(Long id);
}

