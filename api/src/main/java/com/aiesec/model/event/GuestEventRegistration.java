package com.aiesec.model.event;

import com.aiesec.enums.InterestStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


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

    public Long getGuestUserId() {
        return guestUserId;
    }

    public void setGuestUserId(Long guestUserId) {
        this.guestUserId = guestUserId;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }
}



