package com.example.EventManagement.entity;

import jakarta.persistence.*;

@Entity
public class LocalCommitteePresident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LCP_ID")
    private Long id;

    private String name;

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
