package com.aiesec.model.event;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "event_gallery")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventGallery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gallery_id")
    private Long galleryId;

    @Column(name = "image_url", nullable = false, length = 255)
    private String imageUrl;

    @Column(name = "category", length = 255)
    private String category;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    @Column(name = "storage_path")
    private String storagePath;

}
