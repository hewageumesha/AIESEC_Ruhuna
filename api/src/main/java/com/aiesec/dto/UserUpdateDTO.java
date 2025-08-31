package com.aiesec.dto;

import com.aiesec.enums.UserRole;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateDTO {
    private UserRole role;
    private Long functionId;
}
