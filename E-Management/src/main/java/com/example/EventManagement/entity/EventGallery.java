package com.example.EventManagement.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Event_Gallery")

public class EventGallery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId; // Maps to Image_ID

    @Column(nullable = false)
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "Event_ID", referencedColumnName = "Event_ID", nullable = false)
    private Event event; // Foreign key reference to Event


}
