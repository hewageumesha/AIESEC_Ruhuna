package com.aiesec.dto;

import com.aiesec.enums.UserRole;

public class UserUpdateDTO {
    private UserRole role;
    private Long functionId;
    private Long departmentId;

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
    public Long getDepartmentId() {
        return departmentId;
    }
    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }
}
