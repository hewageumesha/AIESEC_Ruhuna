package com.aiesec.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter

public class TrendDTO {
    private LocalDate date;
    private int memberRegistrations;
    private int guestRegistrations;

    public TrendDTO(LocalDate date, int memberRegistrations, int guestRegistrations) {
        this.date = date;
        this.memberRegistrations = memberRegistrations;
        this.guestRegistrations = guestRegistrations;
    }


}