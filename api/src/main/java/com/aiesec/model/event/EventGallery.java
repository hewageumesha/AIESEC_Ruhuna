package com.aiesec.model.event;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "gallery")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventGallery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gallery_id")
    private Long galleryId;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "storage_path", nullable = false, length = 255)
    private String storagePath;

    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;

    // For annual events - images belong to a specific version
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_version_id")
    private EventVersion eventVersion;

    // For one-time events - images belong directly to category
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private EventCategory category;

    @PrePersist
    protected void onCreate() {
        if (uploadedAt == null) {
            uploadedAt = LocalDateTime.now();
        }
    }

    // Helper methods to determine upload type
    public boolean isVersionBased() {
        return eventVersion != null;
    }

    public boolean isCategoryBased() {
        return category != null;
    }

    // Get the associated category (either direct or through version)
    public EventCategory getAssociatedCategory() {
        if (category != null) {
            return category;
        } else if (eventVersion != null && eventVersion.getEventCategory() != null) {
            return eventVersion.getEventCategory();
        }
        return null;
    }
}