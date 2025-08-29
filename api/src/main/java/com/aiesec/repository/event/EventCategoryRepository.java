
package com.aiesec.repository.event;

import com.aiesec.model.event.EventCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventCategoryRepository extends JpaRepository<EventCategory, Long> {

    Optional<EventCategory> findByCategoryNameIgnoreCase(String categoryName);

    List<EventCategory> findByIsAnnualTrue();

    @Query("SELECT DISTINCT ec FROM EventCategory ec " +
            "JOIN ec.eventVersions ev " +
            "JOIN ev.galleryImages gi " +
            "WHERE gi.galleryId IS NOT NULL")
    List<EventCategory> findCategoriesWithGalleryImages();
}