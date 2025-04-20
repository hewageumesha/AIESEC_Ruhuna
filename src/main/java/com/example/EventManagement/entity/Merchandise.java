package com.example.EventManagement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "event_merchandise")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Merchandise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Merchandise_ID")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "Event_ID", nullable = false)
    private Event event;  // Reference to the Event entity

    @Column(name = "Item_Name", nullable = false, length = 100)
    private String itemName;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "Image_URL", length = 255)
    private String imageUrl;

    @Column(name = "Price", precision = 10, scale = 2)
    private BigDecimal price;
}
