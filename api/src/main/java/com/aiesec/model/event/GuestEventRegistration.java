package com.aiesec.model.event;

import com.aiesec.enums.InterestStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity

public class GuestEventRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long eventId;

    private String guestName;
    private String email;
    private String phone;
    private LocalDateTime registrationDate;
    @Enumerated(EnumType.STRING)
    private InterestStatus interestStatus;
    private String comment;

}



