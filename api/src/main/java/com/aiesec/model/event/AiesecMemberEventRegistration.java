package com.aiesec.model.event;


import com.aiesec.enums.InterestStatus;
import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
public class AiesecMemberEventRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long UserId;
    private Long EventId;

    @Enumerated(EnumType.STRING)
    private InterestStatus interestStatus;
    private String comment;

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        UserId = userId;
    }

    public void setEventId(Long eventId) {
        EventId = eventId;
    }

    public void setInterestStatus(InterestStatus interestStatus) {
        this.interestStatus = interestStatus;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
