package com.aiesec.service.impl;

import com.aiesec.dto.EventCategoryDTO;
import com.aiesec.dto.EventVersionDTO;
import com.aiesec.dto.GalleryDTO;
import com.aiesec.mapper.EventCategoryMapper;
import com.aiesec.mapper.EventVersionMapper;
import com.aiesec.mapper.GalleryMapper;
import com.aiesec.model.event.EventCategory;
import com.aiesec.model.event.EventVersion;
import com.aiesec.model.event.EventGallery;
import com.aiesec.repository.event.EventCategoryRepository;
import com.aiesec.repository.event.EventVersionRepository;
import com.aiesec.repository.event.GalleryRepository;
import com.aiesec.service.interfaces.EventCategoryService;
import com.aiesec.service.interfaces.EventVersionService;
import com.aiesec.service.interfaces.GalleryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventCategoryServiceImpl implements EventCategoryService {

    @Autowired
    private EventCategoryRepository categoryRepository;

    @Override
    public EventCategoryDTO createCategory(EventCategoryDTO categoryDTO) {
        EventCategory category = EventCategoryMapper.toEntity(categoryDTO);
        EventCategory saved = categoryRepository.save(category);
        return EventCategoryMapper.toDTO(saved);
    }

    @Override
    public List<EventCategoryDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(EventCategoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventCategoryDTO> getCategoriesWithGalleryImages() {
        return categoryRepository.findCategoriesWithGalleryImages()
                .stream()
                .map(EventCategoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EventCategoryDTO getCategoryById(Long id) {
        EventCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        return EventCategoryMapper.toDTO(category);
    }

    @Override
    public EventCategoryDTO updateCategory(Long id, EventCategoryDTO categoryDTO) {
        EventCategory existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        existing.setCategoryName(categoryDTO.getCategoryName());
        existing.setIsAnnual(categoryDTO.getIsAnnual());

        EventCategory updated = categoryRepository.save(existing);
        return EventCategoryMapper.toDTO(updated);
    }

    @Override
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}