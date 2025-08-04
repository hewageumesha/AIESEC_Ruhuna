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

    // ✅ Add a new image to the gallery (only for LCP, LCVP roles)
    @PostMapping("/{eventId}")
    public ResponseEntity<GalleryDTO> addImageToGallery(
            @PathVariable Long eventId,
            @RequestBody GalleryDTO galleryDTO) {
        GalleryDTO savedImage = galleryService.uploadGalleryImage(galleryDTO);
        return ResponseEntity.ok(savedImage);
    }

    // ✅ Get all images for a specific event
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<GalleryDTO>> getGalleryByEvent(@PathVariable Long eventId) {
        List<GalleryDTO> galleryList = galleryService.getGalleryImagesByEventId(eventId);
        return ResponseEntity.ok(galleryList);
    }

    // ✅ Get all gallery images (for the home page – past events)
    @GetMapping
    public ResponseEntity<List<GalleryDTO>> getAllGalleryImages() {
        List<GalleryDTO> allImages = galleryService.getAllGalleryImages();
        return ResponseEntity.ok(allImages);
    }

    // ✅ Delete a gallery image by ID (only for LCP, LCVP)
    @DeleteMapping("/{galleryId}")
    public ResponseEntity<Void> deleteGalleryImage(@PathVariable Long galleryId) {
        galleryService.deleteGalleryImage(galleryId);
        return ResponseEntity.noContent().build();
    }
}

