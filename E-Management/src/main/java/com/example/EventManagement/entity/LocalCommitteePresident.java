package com.example.EventManagement.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "LocalCommitteePresident") // Ensure table name matches your DB
public class LocalCommitteePresident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LCVP_ID") // Map correctly to the DB primary key
    private Long id;

    @Column(name = "name") // Ensure column mapping
    private String name;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
