
package com.example.EventManagement.repository;


import com.example.EventManagement.entity.Event;
import com.example.EventManagement.entity.EventGallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventGalleryRepository extends JpaRepository<EventGallery, Long> {
    // Get all images for a specific event
    List<EventGallery> findByEvent_EventId(Long eventId);
}
