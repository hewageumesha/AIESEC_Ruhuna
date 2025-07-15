package com.aiesec.model.event;

import com.aiesec.enums.InterestStatus;
import com.aiesec.enums.RegistrationType;
import com.aiesec.model.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class AiesecMemberEventRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Save user_id directly
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // Save event_id directly
    @Column(name = "event_id", nullable = false)
    private Long eventId;

    // Optional: if you want to fetch user details
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", insertable = false, updatable = false)
    private User user;

    // Optional: if you want to fetch event details
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", referencedColumnName = "event_id", insertable = false, updatable = false)
    private Event event;

    @Enumerated(EnumType.STRING)
    @Column(name = "interest_status")
    private InterestStatus interestStatus;

    @Enumerated(EnumType.STRING)
    private RegistrationType type;

    private String comment;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime registeredAt;
}
