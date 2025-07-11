package com.aiesec.dto;

import com.aiesec.enums.UserRole;

public class UserRequestDTO {
    private String aiesecEmail;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
    private Long functionId;
    private Long departmentId;
    private String teamLeaderAiesecEmail;

    public String getAiesecEmail() {
        return aiesecEmail;
    }
    public void setAiesecEmail(String aiesecEmail) {
        this.aiesecEmail = aiesecEmail;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
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
    public String getTeamLeaderAiesecEmail() {
        return teamLeaderAiesecEmail;
    }
    public void setTeamLeaderAiesecEmail(String teamLeaderAiesecEmail) {
        this.teamLeaderAiesecEmail = teamLeaderAiesecEmail;
    } 
}
