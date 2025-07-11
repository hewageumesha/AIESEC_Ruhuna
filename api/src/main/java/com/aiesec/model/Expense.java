package com.aiesec.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private LocalDate date;

    @NotNull
    private Double amount;

    @NotNull
    private String category;

    private String description;

    @NotNull
    private String paymentMethod;

    @NotNull
    private String role;

    @NotNull
    private String userId;
}
