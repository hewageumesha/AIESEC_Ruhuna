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
    private Long eventId;
    private String name;
    private String email;
    private String phone;
    @Enumerated(EnumType.STRING)
    private InterestStatus interestStatus;
    private String comment;
    private LocalDateTime registeredAt;

}



