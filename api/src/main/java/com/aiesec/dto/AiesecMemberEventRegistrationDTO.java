package com.aiesec.dto;

import com.aiesec.enums.InterestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder


public class AiesecMemberEventRegistrationDTO {
    private Long userId;
    private Long eventId;
    private InterestStatus interestStatus;
    private String comment;
}