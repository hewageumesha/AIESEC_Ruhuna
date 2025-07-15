package com.aiesec.service.interfaces;

import com.aiesec.dto.GalleryDTO;

import java.util.List;

public interface GalleryService {

    GalleryDTO uploadGalleryImage(GalleryDTO dto);
    List<GalleryDTO> getAllGalleryImages();
    List<GalleryDTO> getGalleryImagesByCategory(String category);
    void deleteGalleryImage(Long id);
    void deleteGalleryImagesByIds(List<Long> ids);

}
