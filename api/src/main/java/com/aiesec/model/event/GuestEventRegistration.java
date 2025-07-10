package com.aiesec.model.event;

import com.aiesec.enums.InterestStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
 @Table(name = "guest_event_registration")

@Builder
@NoArgsConstructor
@AllArgsConstructor

public class GuestEventRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long guestUserId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Event_ID", referencedColumnName = "Event_ID")
    private Event event;

    private String name;
    private String email;
    private String phone;
    @Enumerated(EnumType.STRING)
    private InterestStatus interestStatus;
    private String comment;
    private LocalDateTime registeredAt;

}



