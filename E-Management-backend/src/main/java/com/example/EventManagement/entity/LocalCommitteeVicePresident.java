package com.example.EventManagement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class LocalCommitteeVicePresident {
    @Id
    private Long id;



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
