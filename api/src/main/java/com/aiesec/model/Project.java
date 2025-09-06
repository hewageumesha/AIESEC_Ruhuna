package com.aiesec.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String status; // e.g., "Planned", "Ongoing", "Completed"
    private LocalDate startDate;
    private LocalDate endDate;
    @ElementCollection
    private List<String> photos;

    @ElementCollection
    private List<String> links;

    public Project() {}

    public Project(String name, String description, String status, LocalDate startDate, LocalDate endDate, List<String> photos, List<String> links) {
        this.name = name;
        this.description = description;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.photos = photos;
        this.links = links;
    }
}

