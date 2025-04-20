package com.example.EventManagement.repository;

import com.example.EventManagement.entity.EventGallery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GalleryRepository extends JpaRepository<EventGallery, Long> {
    List<EventGallery> findByEvent_EventId(Long eventId);
}
