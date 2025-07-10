package com.aiesec.controller.event;

import com.aiesec.dto.GalleryDTO;
import com.aiesec.service.interfaces.GalleryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    private final GalleryService galleryService;

    @Autowired
    public GalleryController(GalleryService galleryService) {
        this.galleryService = galleryService;
    }

    // Upload image with imageUrl and category only
    @PostMapping
    public ResponseEntity<GalleryDTO> uploadGalleryImage(@RequestBody GalleryDTO galleryDTO) {
        GalleryDTO savedImage = galleryService.uploadGalleryImage(galleryDTO);
        return ResponseEntity.ok(savedImage);
    }

    // Get all images
    @GetMapping
    public ResponseEntity<List<GalleryDTO>> getAllGalleryImages() {
        List<GalleryDTO> allImages = galleryService.getAllGalleryImages();
        return ResponseEntity.ok(allImages);
    }

    // Get images filtered by category (pass ?category=CategoryName)
    @GetMapping("/category")
    public ResponseEntity<List<GalleryDTO>> getGalleryByCategory(@RequestParam String category) {
        List<GalleryDTO> images = galleryService.getGalleryImagesByCategory(category);
        return ResponseEntity.ok(images);
    }

    // Delete image by id
    @DeleteMapping("/{galleryId}")
    public ResponseEntity<Void> deleteGalleryImage(@PathVariable Long galleryId) {
        galleryService.deleteGalleryImage(galleryId);
        return ResponseEntity.noContent().build();
    }
}
