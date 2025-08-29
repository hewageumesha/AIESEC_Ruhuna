package com.aiesec.service.interfaces;

import com.aiesec.dto.EventCategoryDTO;
import com.aiesec.dto.EventVersionDTO;
import java.util.List;

public interface EventCategoryService {
    EventCategoryDTO createCategory(EventCategoryDTO categoryDTO);
    List<EventCategoryDTO> getAllCategories();
    List<EventCategoryDTO> getCategoriesWithGalleryImages();
    EventCategoryDTO getCategoryById(Long id);
    EventCategoryDTO updateCategory(Long id, EventCategoryDTO categoryDTO);
    void deleteCategory(Long id);
}