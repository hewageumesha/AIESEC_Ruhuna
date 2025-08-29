package com.aiesec.service.interfaces;

import com.aiesec.dto.EventVersionDTO;

import java.util.List;

public interface EventVersionService {
    EventVersionDTO createVersion(EventVersionDTO versionDTO);
    List<EventVersionDTO> getVersionsByCategoryId(Long categoryId);
    List<EventVersionDTO> getVersionsWithGalleryImagesByCategoryId(Long categoryId);
    EventVersionDTO getVersionById(Long id);
    EventVersionDTO updateVersion(Long id, EventVersionDTO versionDTO);
    void deleteVersion(Long id);
}
