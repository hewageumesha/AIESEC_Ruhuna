package com.aiesec.service.impl;


import com.aiesec.dto.EventVersionDTO;
import com.aiesec.mapper.EventVersionMapper;
import com.aiesec.model.event.EventCategory;
import com.aiesec.model.event.EventVersion;
import com.aiesec.repository.event.EventCategoryRepository;
import com.aiesec.repository.event.EventVersionRepository;
import com.aiesec.service.interfaces.EventVersionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventVersionServiceImpl implements EventVersionService {

    @Autowired
    private EventVersionRepository versionRepository;

    @Autowired
    private EventCategoryRepository categoryRepository;

    @Override
    public EventVersionDTO createVersion(EventVersionDTO versionDTO) {
        EventCategory category = categoryRepository.findById(versionDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + versionDTO.getCategoryId()));

        EventVersion version = EventVersionMapper.toEntity(versionDTO, category);
        EventVersion saved = versionRepository.save(version);
        return EventVersionMapper.toDTO(saved);
    }

    @Override
    public List<EventVersionDTO> getVersionsByCategoryId(Long categoryId) {
        return versionRepository.findByEventCategoryId(categoryId)
                .stream()
                .map(EventVersionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventVersionDTO> getVersionsWithGalleryImagesByCategoryId(Long categoryId) {
        return versionRepository.findVersionsWithGalleryImagesByCategoryId(categoryId)
                .stream()
                .map(EventVersionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EventVersionDTO getVersionById(Long id) {
        EventVersion version = versionRepository.findByIdWithCategory(id)
                .orElseThrow(() -> new RuntimeException("Version not found with id: " + id));
        return EventVersionMapper.toDTO(version);
    }

    @Override
    public EventVersionDTO updateVersion(Long id, EventVersionDTO versionDTO) {
        EventVersion existing = versionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Version not found with id: " + id));

        existing.setVersionName(versionDTO.getVersionName());
        existing.setEventDate(versionDTO.getEventDate());
        existing.setDescription(versionDTO.getDescription());
        existing.setIsActive(versionDTO.getIsActive());

        EventVersion updated = versionRepository.save(existing);
        return EventVersionMapper.toDTO(updated);
    }

    @Override
    public void deleteVersion(Long id) {
        versionRepository.deleteById(id);
    }
}