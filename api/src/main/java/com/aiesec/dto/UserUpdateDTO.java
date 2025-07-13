package com.aiesec.dto;

import com.aiesec.enums.UserRole;

public class UserUpdateDTO {
    private UserRole role;
    private Long functionId;

    public UserRole getRole() {
        return role;
    }
    public void setRole(UserRole role) {
        this.role = role;
    }
    public Long getFunctionId() {
        return functionId;
    }
    public void setFunctionId(Long functionId) {
        this.functionId = functionId;
    }
}
