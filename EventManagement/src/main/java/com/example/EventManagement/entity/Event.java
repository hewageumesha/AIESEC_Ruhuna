package com.example.EventManagement.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.autoconfigure.web.WebProperties;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Event")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long eventId;  // Maps to Event_ID


    @Column(nullable = false)
    private String eventName;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDate eventDate;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private LocalTime eventTime;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String eventPhoto; // Stores image path or URL

    // Foreign Keys (LCP, LCVP, TL)
    @ManyToOne
    @JoinColumn(name = "LCP_ID", referencedColumnName = "LCP_ID")
    private LocalCommitteePresident lcp;

    @ManyToOne
    @JoinColumn(name = "LCVP_ID", referencedColumnName = "id")
    private LocalCommitteeVicePresident lcvp;

    @OneToOne
    @JoinColumn(name = "TL_ID", referencedColumnName = "id")
    private TeamLeader teamLeader;

    // Getters and Setters

}


