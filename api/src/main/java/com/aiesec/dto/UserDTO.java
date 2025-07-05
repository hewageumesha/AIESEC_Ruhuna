package com.aiesec.dto;


import java.sql.Date;
import java.util.List;

import com.aiesec.enums.Gender;
import com.aiesec.enums.UserRole;
import com.aiesec.enums.UserStatus;
import com.aiesec.model.Department;
import com.aiesec.model.Function;

public class UserDTO {
    private Long id;
    private String userName;
    private String lastName;
    private String aiesecEmail;  // Add this field
    private String email;
    private String phone;
    private String about;
    private String streetAddress;
    private String city;
    private String stateORProvince;
    private String ZIPORPostalCode; 
    private Date birthday;
    private Gender gender;
    private Date joinedDate;
    private String profilePicture;
    private UserRole role;
    private UserStatus status;
    private Function functionId;  
    private String functionName; 
    private Department departmentId;  
    private String departmentName;  
    private String teamLeaderAiesecEmail;
    private String teamLeaderName;
    private List<UserDTO> teamMembers;
    private List<String> commentsForUser; 
    private List<String> commentsCreated; 

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getStreetAddress() {
        return streetAddress;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStateORProvince() {
        return stateORProvince;
    }

    public void setStateORProvince(String stateORProvince) {
        this.stateORProvince = stateORProvince;
    }

    public String getZIPORPostalCode() {
        return ZIPORPostalCode;
    }

    public void setZIPORPostalCode(String ZIPORPostalCode) {
        this.ZIPORPostalCode = ZIPORPostalCode;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }
    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Date getJoinedDate() {
        return joinedDate;
    }

    public void setJoinedDate(Date joinedDate) {
        this.joinedDate = joinedDate;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public Function getFunctionId() {
        return functionId;
    }

    public void setFunctionId(Function functionId) {
        this.functionId = functionId;
    }

    public String getFunctionName() {
        return functionName;
    }

    public void setFunctionName(String functionName) {
        this.functionName = functionName;
    }

    public Department getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Department departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getTeamLeaderAiesecEmail() {
        return teamLeaderAiesecEmail;
    }

    public void setTeamLeaderAiesecEmail(String teamLeaderAiesecEmail) {
        this.teamLeaderAiesecEmail = teamLeaderAiesecEmail;
    }

    public String getTeamLeaderName() {
        return teamLeaderName;
    }

    public void setTeamLeaderName(String teamLeaderName) {
        this.teamLeaderName = teamLeaderName;
    }

    public List<UserDTO> getTeamMembers() {
        return teamMembers;
    }

    public void setTeamMembers(List<UserDTO> teamMembers) {
        this.teamMembers = teamMembers;
    }

    public List<String> getCommentsForUser() {
        return commentsForUser;
    }

    public void setCommentsForUser(List<String> commentsForUser) {
        this.commentsForUser = commentsForUser;
    }

    public List<String> getCommentsCreated() {
        return commentsCreated;
    }

    public void setCommentsCreated(List<String> commentsCreated) {
        this.commentsCreated = commentsCreated;
    }
        public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }
}

