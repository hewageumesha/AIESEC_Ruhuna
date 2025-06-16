package com.aiesec.dto;


import com.aiesec.enums.UserRole;
import com.aiesec.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String aiesecEmail;
    private String phoneNumber;
    private String password;
    private String profilePicture;
    private LocalDate birthday;
    private LocalDate joinedDate;
    private String assignedTeam;
    private UserRole role;
    private UserStatus status;
}
