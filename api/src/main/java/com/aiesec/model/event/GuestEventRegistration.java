package com.aiesec.model.event;

import com.aiesec.enums.InterestStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getGuestName() {
        return guestName;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
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

    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDateTime registrationDate) {
        this.registrationDate = registrationDate;
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



