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
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Event_ID", referencedColumnName = "Event_ID")
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", referencedColumnName = "id", insertable = false, updatable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private InterestStatus interestStatus;

    @Enumerated(EnumType.STRING)
    private RegistrationType type;

    private String comment;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime registeredAt;


}
