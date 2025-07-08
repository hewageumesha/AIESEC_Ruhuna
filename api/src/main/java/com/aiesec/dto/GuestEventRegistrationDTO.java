package com.aiesec.dto;

import com.aiesec.enums.InterestStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GuestEventRegistrationDTO {

    private Long guestUserId;

    @NotNull(message = "Event ID is required")
    private Long eventId;

    private String eventName;

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;

    private InterestStatus interestStatus;

    private String comment;

    private LocalDateTime registeredAt;
}
