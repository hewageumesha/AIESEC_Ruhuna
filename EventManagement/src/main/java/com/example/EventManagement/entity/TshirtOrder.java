package com.example.EventManagement.entity;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "TShirt_Order")
public class TshirtOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String contactNumber;

    @Column(nullable = false,unique = true)
    private String email;

    @Column(nullable = false)
    private String faculty;

    @Column(nullable = false)
    private String academicYear;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TShirtSize tshirtSize; // Enum for sizes (S, M, L, XL, XXL)

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false, updatable = false)
    private LocalDateTime orderDate = LocalDateTime.now(); // Auto set timestamp

    // Getters and Setters

    public enum TShirtSize {
        S, M, L, XL, XXL
    }




}
