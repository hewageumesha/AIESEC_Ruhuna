package com.example.EventManagement.entity;
import com.example.EventManagement.enums.InterestStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "member_event_interest")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberEventInterest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Interest_ID")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "Event_ID", nullable = false)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "User_ID", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "Interest_Status", nullable = false)
    private InterestStatus interestStatus;

    @Column(name = "Comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "Responded_At", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime respondedAt;
}
