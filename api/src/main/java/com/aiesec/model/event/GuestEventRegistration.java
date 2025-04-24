package com.aiesec.model.event;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "guest_event_registration")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuestEventRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Registration_ID")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "Guest_ID", nullable = false)
    private GuestUser guestUser;

    @ManyToOne
    @JoinColumn(name = "Event_ID", nullable = false)
    private Event event;

    @Column(name = "Excitement_Level")
    private Integer excitementLevel;  // Optional: e.g. 1–5

    @Column(name = "Expectation", columnDefinition = "TEXT")
    private String expectation;

    @Column(name = "Registered_At", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime registeredAt;
}

