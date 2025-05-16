package com.aiesec.model.event;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Merchandise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean available; // Is T-shirt order available?

    private String description; // Small description about the T-shirt

    @ElementCollection
    @CollectionTable(name = "merchandise_images", joinColumns = @JoinColumn(name = "merchandise_id"))
    @Column(name = "image_url")
    private List<String> imageUrls;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;


}