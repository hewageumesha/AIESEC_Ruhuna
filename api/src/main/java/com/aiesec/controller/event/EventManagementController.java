package com.aiesec.controller.event;

import com.aiesec.dto.EventCategoryDTO;
import com.aiesec.dto.EventVersionDTO;
import com.aiesec.service.interfaces.EventCategoryService;
import com.aiesec.service.interfaces.EventVersionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class EventManagementController {

    @Autowired
    private EventCategoryService categoryService;

    @Autowired
    private EventVersionService versionService;

    // Category endpoints
    @PostMapping("/categories")
    public ResponseEntity<EventCategoryDTO> createCategory(@RequestBody EventCategoryDTO categoryDTO) {
        EventCategoryDTO created = categoryService.createCategory(categoryDTO);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<EventCategoryDTO>> getAllCategories() {
        List<EventCategoryDTO> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/categories/with-gallery")
    public ResponseEntity<List<EventCategoryDTO>> getCategoriesWithGalleryImages() {
        List<EventCategoryDTO> categories = categoryService.getCategoriesWithGalleryImages();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<EventCategoryDTO> getCategoryById(@PathVariable Long id) {
        EventCategoryDTO category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<EventCategoryDTO> updateCategory(@PathVariable Long id, @RequestBody EventCategoryDTO categoryDTO) {
        EventCategoryDTO updated = categoryService.updateCategory(id, categoryDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    // Version endpoints
    @PostMapping("/versions")
    public ResponseEntity<EventVersionDTO> createVersion(@RequestBody EventVersionDTO versionDTO) {
        EventVersionDTO created = versionService.createVersion(versionDTO);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/categories/{categoryId}/versions")
    public ResponseEntity<List<EventVersionDTO>> getVersionsByCategoryId(@PathVariable Long categoryId) {
        List<EventVersionDTO> versions = versionService.getVersionsByCategoryId(categoryId);
        return ResponseEntity.ok(versions);
    }

    @GetMapping("/categories/{categoryId}/versions/with-gallery")
    public ResponseEntity<List<EventVersionDTO>> getVersionsWithGalleryImagesByCategoryId(@PathVariable Long categoryId) {
        List<EventVersionDTO> versions = versionService.getVersionsWithGalleryImagesByCategoryId(categoryId);
        return ResponseEntity.ok(versions);
    }

    @GetMapping("/versions/{id}")
    public ResponseEntity<EventVersionDTO> getVersionById(@PathVariable Long id) {
        EventVersionDTO version = versionService.getVersionById(id);
        return ResponseEntity.ok(version);
    }

    @PutMapping("/versions/{id}")
    public ResponseEntity<EventVersionDTO> updateVersion(@PathVariable Long id, @RequestBody EventVersionDTO versionDTO) {
        EventVersionDTO updated = versionService.updateVersion(id, versionDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/versions/{id}")
    public ResponseEntity<Void> deleteVersion(@PathVariable Long id) {
        versionService.deleteVersion(id);
        return ResponseEntity.noContent().build();
    }
}
