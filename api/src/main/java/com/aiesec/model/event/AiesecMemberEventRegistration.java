package com.aiesec.model.event;


import com.aiesec.enums.InterestStatus;
import jakarta.persistence.*;

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return UserId;
    }

    public void setUserId(Long userId) {
        UserId = userId;
    }

    public Long getEventId() {
        return EventId;
    }

    public void setEventId(Long eventId) {
        EventId = eventId;
    }

    public InterestStatus getInterestStatus() {
        return interestStatus;
    }

    public void setInterestStatus(InterestStatus interestStatus) {
        this.interestStatus = interestStatus;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
