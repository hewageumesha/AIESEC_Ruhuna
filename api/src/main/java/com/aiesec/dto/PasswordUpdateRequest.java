package com.aiesec.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordUpdateRequest {
    private String userAiesecEmail;
    private String currentPassword;
    private String newPassword;
}
