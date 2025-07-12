package com.aiesec.repository.event;

import com.aiesec.model.event.EventGallery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GalleryRepository extends JpaRepository<EventGallery, Long> {
    List<EventGallery> findByCategory(String category);

}
