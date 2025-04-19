package com.example.EventManagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "event_series")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class EventSeries {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Series_ID")
    private Long id;

    @Column(name = "Series_Name", nullable = false, length = 150)
    private String name;
}