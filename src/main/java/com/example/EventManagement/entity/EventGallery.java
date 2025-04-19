package com.example.EventManagement.entity;
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

    @ManyToOne
    @JoinColumn(name = "Event_ID", nullable = false)
    private Event event;

    @Column(name = "Image_URL", nullable = false, length = 255)
    private String imageUrl;

    @Column(name = "Caption", length = 255)
    private String caption;

       @Column(name = "uploaded_at")
       private LocalDateTime uploadedAt;
}
