package com.aiesec.controller.event;

import com.aiesec.dto.GalleryDTO;
import com.aiesec.service.interfaces.GalleryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
@CrossOrigin(origins = "*")
public class GalleryController {

    private final GalleryService galleryService;

    @Autowired
    public GalleryController(GalleryService galleryService) {
        this.galleryService = galleryService;
    }

    // Upload image with eventVersionId
    @PostMapping
    public ResponseEntity<GalleryDTO> uploadGalleryImage(@RequestBody GalleryDTO galleryDTO) {
        GalleryDTO savedImage = galleryService.uploadGalleryImage(galleryDTO);
        return ResponseEntity.ok(savedImage);
    }

    // Get all images with event details
    @GetMapping
    public ResponseEntity<List<GalleryDTO>> getAllGalleryImages() {
        List<GalleryDTO> allImages = galleryService.getAllGalleryImages();
        return ResponseEntity.ok(allImages);
    }

    // Get images by category ID
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<GalleryDTO>> getGalleryByCategoryId(@PathVariable Long categoryId) {
        List<GalleryDTO> images = galleryService.getGalleryImagesByCategoryId(categoryId);
        return ResponseEntity.ok(images);
    }

    // Get images by version ID
    @GetMapping("/version/{versionId}")
    public ResponseEntity<List<GalleryDTO>> getGalleryByVersionId(@PathVariable Long versionId) {
        List<GalleryDTO> images = galleryService.getGalleryImagesByVersionId(versionId);
        return ResponseEntity.ok(images);
    }

    // Delete single image
    @DeleteMapping("/{galleryId}")
    public ResponseEntity<Void> deleteGalleryImage(@PathVariable Long galleryId) {
        galleryService.deleteGalleryImage(galleryId);
        return ResponseEntity.noContent().build();
    }

    // Delete multiple images
    @DeleteMapping("/batch")
    public ResponseEntity<Void> deleteMultipleGalleryImages(@RequestBody List<Long> galleryIds) {
        galleryService.deleteGalleryImagesByIds(galleryIds);
        return ResponseEntity.noContent().build();
    }
}