package com.aiesec.repository.event;
import com.aiesec.model.event.EventVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventVersionRepository extends JpaRepository<EventVersion, Long> {

    List<EventVersion> findByEventCategoryIdAndIsActiveTrue(Long categoryId);

    List<EventVersion> findByEventCategoryId(Long categoryId);

    @Query("SELECT ev FROM EventVersion ev " +
            "JOIN FETCH ev.eventCategory " +
            "WHERE ev.id = :versionId")
    Optional<EventVersion> findByIdWithCategory(Long versionId);

    @Query("SELECT DISTINCT ev FROM EventVersion ev " +
            "JOIN ev.galleryImages gi " +
            "WHERE ev.eventCategory.id = :categoryId " +
            "AND gi.galleryId IS NOT NULL")
    List<EventVersion> findVersionsWithGalleryImagesByCategoryId(Long categoryId);
}