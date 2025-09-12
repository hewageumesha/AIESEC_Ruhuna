package com.aiesec.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Getter
@Setter
@Entity
@Table(name = "projects")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private String logo;
    private String overview;
    private String description;
    private String sdgFocus;
    private String projectFee;
    private String projectActivities;

    @ElementCollection
    private List<String> opportunityLinks;

    @ElementCollection
    private List<String> projectBooklets;

    @ElementCollection
    private List<String> availableSlots;

    @ElementCollection
    private List<String> photos;

    @ElementCollection
    @CollectionTable(name = "project_links")
    @MapKeyColumn(name = "topic")
    @Column(name = "url")
    private Map<String, String> links;

    @Column(nullable = false)
    private Boolean published = false;

    @Embedded
    private Logistics logistics;

    @Embedded
    private Eligibility eligibility;

    private String role;

    public Project() {}

    public Project(Long id, String name, String type, String logo, String overview, String description, String sdgFocus,
            String projectFee, String projectActivities, List<String> opportunityLinks, List<String> projectBooklets,
            List<String> availableSlots, List<String> photos, Map<String, String> links, Logistics logistics,
            Eligibility eligibility, String role) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.logo = logo;
        this.overview = overview;
        this.description = description;
        this.sdgFocus = sdgFocus;
        this.projectFee = projectFee;
        this.projectActivities = projectActivities;
        this.opportunityLinks = opportunityLinks;
        this.projectBooklets = projectBooklets;
        this.availableSlots = availableSlots;
        this.photos = photos;
        this.links = links;
        this.logistics = logistics;
        this.eligibility = eligibility;
        this.role = role;
    }
}

