package com.aiesec.model.event;


import com.aiesec.enums.InterestStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
public class AiesecMemberEventRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Long eventId;

    @Enumerated(EnumType.STRING)
    private InterestStatus interestStatus;
    private String comment;
    private LocalDateTime registeredAt;

}
