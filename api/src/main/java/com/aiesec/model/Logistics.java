package com.aiesec.model;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Embeddable
public class Logistics {
    private String accommodation;
    private String transportation;
    private String meals;
    private String computer;

    public Logistics() {
    }

    public Logistics(String accommodation, String transportation, String meals, String computer) {
        this.accommodation = accommodation;
        this.transportation = transportation;
        this.meals = meals;
        this.computer = computer;
    }
}
