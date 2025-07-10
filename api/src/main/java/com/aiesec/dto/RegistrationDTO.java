package com.aiesec.dto;


import com.aiesec.enums.InterestStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationDTO {
    private Long eventId;
    private Long userId;
    private String interestStatus;
    private String comment;

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public InterestStatus getInterestStatus() {
        this.interestStatus=interestStatus.toString();
        return null;
    }

    public void setInterestStatus(String interestStatus) {
        this.interestStatus = interestStatus;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
