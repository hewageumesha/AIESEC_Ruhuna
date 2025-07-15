package com.aiesec.dto;

import com.aiesec.enums.UserRole;

import java.util.List;


public class UserHierarchyDTO {
    private Long id;
    private String name;
    private String aiesecEmail;
    private UserRole role;
    private String functionName;
    private String profilePicture;
    private String phoneNumber;
    private List<UserHierarchyDTO> children;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getAiesecEmail() {
        return aiesecEmail;
    }
    public void setAiesecEmail(String aiesecEmail) {
        this.aiesecEmail = aiesecEmail;
    }
    public UserRole getRole() {
        return role;
    }
    public void setRole(UserRole role) {
        this.role = role;
    }
    public String getFunctionName() {
        return functionName;
    }
    public void setFunctionName(String functionName) {
        this.functionName = functionName;
    }
    public String getProfilePicture() {
        return profilePicture;
    }
    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
    public List<UserHierarchyDTO> getChildren() {
        return children;
    }
    public void setChildren(List<UserHierarchyDTO> children) {
        this.children = children;
    }
    public String getPhoneNumber() {
        return phoneNumber;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }    
}
