
package com.aiesec.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;


@Entity
public class BirthdayPerson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // This will auto-generate the ID in the database
    private Long id; // Add ID for the database record

    private String name;
    private LocalDate birthday;
    private String photoUrl;

    // Constructor
    public BirthdayPerson(String name, LocalDate birthday, String photoUrl) {
        this.name = name;
        this.birthday = birthday;
        this.photoUrl = photoUrl;
    
    }

    // Getters and setters
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

    public LocalDate getBirthday() {
        return birthday;
    }

    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public BirthdayPerson() {
        // Default no-args constructor
    }
    
}
