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
public class GuestEventRegistrationDTO {
    private Long eventId;
    private String name;
    private String email;
    private String phone;
    private InterestStatus interestStatus;
    private String comment;
}

