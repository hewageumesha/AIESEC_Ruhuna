package com.aiesec.model;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Embeddable
public class Eligibility {
    private String age;
    private String languages;
    private String gender;
    
    public Eligibility() {
    }

    public Eligibility(String age, String languages, String gender) {
        this.age = age;
        this.languages = languages;
        this.gender = gender;
    }
}
