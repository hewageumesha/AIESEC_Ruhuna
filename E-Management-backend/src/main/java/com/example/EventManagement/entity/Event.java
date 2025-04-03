package com.example.EventManagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "event")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "Event_ID")
    private long eventId;

    @Column(nullable = false,name = "event_name")
    private String eventName;

    @Column(nullable = false,name= "Description")
    private String description;


    @Column(nullable = false,name = "Start_Date")
    private LocalDate startDate ;


    @Column(nullable = false,name="End_Date")
    private LocalDate  endDate;

    @Column(nullable = false,name="Event_Time")
    private LocalTime eventTime;

    @Column(nullable = false,name="Location")
    private String location;

    @Column(nullable = true,name="Event_Photo")
    private String eventPhoto; // Stores image path or URL


}
