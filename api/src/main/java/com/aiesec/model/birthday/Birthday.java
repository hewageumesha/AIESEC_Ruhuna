package com.aiesec.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Birthday {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private LocalDate date;
    private String photoUrl;
    


    // Default constructor
    public Birthday() {}

    // Custom constructor
    public Birthday(String name, LocalDate date, String photoUrl) {
        this.name = name;
        this.date = date;
        this.photoUrl = photoUrl;
       
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }


    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    
}
