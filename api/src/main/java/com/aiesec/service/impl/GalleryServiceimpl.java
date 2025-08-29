package com.aiesec.service.impl;

import com.aiesec.dto.GalleryDTO;

import com.aiesec.model.event.EventCategory;
import com.aiesec.model.event.EventGallery;
import com.aiesec.model.event.EventVersion;
import com.aiesec.repository.event.EventCategoryRepository;
import com.aiesec.repository.event.EventVersionRepository;
import com.aiesec.repository.event.GalleryRepository;
import com.aiesec.service.interfaces.GalleryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class GalleryServiceimpl implements GalleryService {

    @Autowired
    private GalleryRepository galleryRepository;

    @Autowired
    private EventVersionRepository eventVersionRepository;

    @Autowired
    private EventCategoryRepository eventCategoryRepository;

    @Override
    public GalleryDTO uploadGalleryImage(GalleryDTO galleryDTO) {
        EventGallery gallery = new EventGallery();
        gallery.setImageUrl(galleryDTO.getImageUrl());
        gallery.setStoragePath(galleryDTO.getStoragePath());

        // Check if this is a version-based upload (annual event)
        if (galleryDTO.getEventVersionId() != null) {
            EventVersion eventVersion = eventVersionRepository.findById(galleryDTO.getEventVersionId())
                    .orElseThrow(() -> new RuntimeException("Event version not found"));
            gallery.setEventVersion(eventVersion);
        }
        // Check if this is a direct category upload (one-time event)
        else if (galleryDTO.getCategoryId() != null) {
            EventCategory category = eventCategoryRepository.findById(galleryDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Event category not found"));

            // Verify this is indeed a one-time event
            if (category.getIsAnnual()) {
                throw new RuntimeException("Annual events must specify a version for image upload");
            }
            gallery.setCategory(category);
        }
        else {
            throw new RuntimeException("Either eventVersionId (for annual events) or categoryId (for one-time events) must be provided");
        }

        EventGallery savedGallery = galleryRepository.save(gallery);
        return convertToDTO(savedGallery);
    }

    @Override
    public List<GalleryDTO> getAllGalleryImages() {
        List<EventGallery> galleries = galleryRepository.findAllWithEventDetails();
        return galleries.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<GalleryDTO> getGalleryImagesByCategoryId(Long categoryId) {
        List<EventGallery> galleries = galleryRepository.findByCategoryIdWithEventDetails(categoryId);
        return galleries.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<GalleryDTO> getGalleryImagesByVersionId(Long versionId) {
        List<EventGallery> galleries = galleryRepository.findByVersionIdWithEventDetails(versionId);
        return galleries.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteGalleryImage(Long galleryId) {
        EventGallery gallery = galleryRepository.findById(galleryId)
                .orElseThrow(() -> new RuntimeException("Gallery image not found"));

        // TODO: Also delete from Supabase storage using gallery.getStoragePath()
        galleryRepository.delete(gallery);
    }

    @Override
    public void deleteGalleryImagesByIds(List<Long> galleryIds) {
        List<EventGallery> galleries = galleryRepository.findAllById(galleryIds);

        // TODO: Also delete from Supabase storage for each gallery.getStoragePath()
        galleryRepository.deleteAll(galleries);
    }

    private GalleryDTO convertToDTO(EventGallery gallery) {
        GalleryDTO dto = new GalleryDTO();
        dto.setGalleryId(gallery.getGalleryId());
        dto.setImageUrl(gallery.getImageUrl());
        dto.setStoragePath(gallery.getStoragePath());
        dto.setUploadedAt(gallery.getUploadedAt());

        // If image belongs to a version (annual event)
        if (gallery.getEventVersion() != null) {
            EventVersion version = gallery.getEventVersion();
            dto.setEventVersionId(version.getId());
            dto.setVersionName(version.getVersionName());
            dto.setEventDate(version.getEventDate());
            dto.setVersionDescription(version.getDescription());

            // Also include category info
            EventCategory category = version.getEventCategory();
            dto.setCategoryId(category.getId());
            dto.setCategoryName(category.getCategoryName());
            dto.setIsAnnual(category.getIsAnnual());
        }
        // If image belongs directly to category (one-time event)
        else if (gallery.getCategory() != null) {
            EventCategory category = gallery.getCategory();
            dto.setCategoryId(category.getId());
            dto.setCategoryName(category.getCategoryName());
            dto.setIsAnnual(category.getIsAnnual());

            // No version info for one-time events
            dto.setEventVersionId(null);
            dto.setVersionName(null);
            dto.setEventDate(null);
            dto.setVersionDescription(null);
        }

        return dto;
    }
}