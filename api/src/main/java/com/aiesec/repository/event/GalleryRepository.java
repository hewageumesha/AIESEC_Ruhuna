package com.aiesec.repository.event;


import com.aiesec.model.event.EventGallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryRepository extends JpaRepository<EventGallery, Long> {

    // Find all gallery images with their event details
    @Query("SELECT g FROM EventGallery g " +
            "LEFT JOIN FETCH g.eventVersion ev " +
            "LEFT JOIN FETCH ev.eventCategory ec1 " +
            "LEFT JOIN FETCH g.category ec2 " +
            "ORDER BY g.uploadedAt DESC")
    List<EventGallery> findAllWithEventDetails();

    // Find gallery images by category ID (includes both direct category images and version-based images)
    @Query("SELECT g FROM EventGallery g " +
            "LEFT JOIN FETCH g.eventVersion ev " +
            "LEFT JOIN FETCH ev.eventCategory ec1 " +
            "LEFT JOIN FETCH g.category ec2 " +
            "WHERE (ec1.id = :categoryId OR ec2.id = :categoryId) " +
            "ORDER BY g.uploadedAt DESC")
    List<EventGallery> findByCategoryIdWithEventDetails(@Param("categoryId") Long categoryId);

    // Find gallery images by version ID (only for annual events)
    @Query("SELECT g FROM EventGallery g " +
            "LEFT JOIN FETCH g.eventVersion ev " +
            "LEFT JOIN FETCH ev.eventCategory ec " +
            "WHERE ev.id = :versionId " +
            "ORDER BY g.uploadedAt DESC")
    List<EventGallery> findByVersionIdWithEventDetails(@Param("versionId") Long versionId);

    // Find images directly linked to a category (one-time events only)
    @Query("SELECT g FROM EventGallery g " +
            "LEFT JOIN FETCH g.category ec " +
            "WHERE g.category.id = :categoryId " +
            "ORDER BY g.uploadedAt DESC")
    List<EventGallery> findByDirectCategoryId(@Param("categoryId") Long categoryId);

    // Find images linked through event versions (annual events only)
    @Query("SELECT g FROM EventGallery g " +
            "LEFT JOIN FETCH g.eventVersion ev " +
            "LEFT JOIN FETCH ev.eventCategory ec " +
            "WHERE ev.eventCategory.id = :categoryId " +
            "ORDER BY g.uploadedAt DESC")
    List<EventGallery> findByEventCategoryId(@Param("categoryId") Long categoryId);

    // Check if a category has any gallery images (either direct or through versions)
    @Query("SELECT CASE WHEN COUNT(g) > 0 THEN true ELSE false END FROM EventGallery g " +
            "LEFT JOIN g.eventVersion ev " +
            "WHERE g.category.id = :categoryId OR ev.eventCategory.id = :categoryId")
    boolean existsByCategoryId(@Param("categoryId") Long categoryId);

    // Check if a version has any gallery images
    @Query("SELECT CASE WHEN COUNT(g) > 0 THEN true ELSE false END FROM EventGallery g " +
            "WHERE g.eventVersion.id = :versionId")
    boolean existsByVersionId(@Param("versionId") Long versionId);

    // Delete all images for a category (both direct and through versions)
    @Query("DELETE FROM EventGallery g WHERE g.category.id = :categoryId OR g.eventVersion.eventCategory.id = :categoryId")
    void deleteByCategoryId(@Param("categoryId") Long categoryId);

    // Delete all images for a version
    @Query("DELETE FROM EventGallery g WHERE g.eventVersion.id = :versionId")
    void deleteByVersionId(@Param("versionId") Long versionId);
}