package com.aiesec.dto;

import java.sql.Date;
import java.util.List;

import com.aiesec.model.Department;
import com.aiesec.model.Function;
import com.aiesec.model.Role;
import com.aiesec.model.Status;

public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String aiesecEmail;
    private String email;
    private String phone;
    private String streetAddress;
    private String city;
    private String stateORProvince;
    private String ZIPORPostalCode;
    private Date birthday;
    private Date joinedDate;
    private String profilePicture;
    private Role role;
    private Status status;
    private Function functionId;
    private Function functionName;
    private Department departmentId;
    private Department departmentName;
    private Long teamLeaderId;
    private String teamLeaderName;
    private List<UserDTO> teamMembers;
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
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
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getAiesecEmail() {
        return aiesecEmail;
    }
    public void setAiesecEmail(String aiesecEmail) {
        this.aiesecEmail = aiesecEmail;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public Date getBirthday() {
        return birthday;
    }
    public void setBirthday(Date birthday) {
        this.birthday = birthday;
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
    public Role getRole() {
        return role;
    }
    public void setRole(Role role) {
        this.role = role;
    }
    public Status getStatus() {
        return status;
    }
    public void setStatus(Status status) {
        this.status = status;
    }
    public Function getFunctionId() {
        return functionId;
    }
    public void setFunctionId(Function functionId) {
        this.functionId = functionId;
    }
    public Function getFunctionName() {
        return functionName;
    }
    public void setFunctionName(Function functionName) {
        this.functionName = functionName;
    }
    public Department getDepartmentId() {
        return departmentId;
    }
    public void setDepartmentId(Department departmentId) {
        this.departmentId = departmentId;
    }
    public Department getDepartmentName() {
        return departmentName;
    }
    public void setDepartmentName(Department departmentName) {
        this.departmentName = departmentName;
    }
    public Long getTeamLeaderId() {
        return teamLeaderId;
    }
    public void setTeamLeaderId(Long teamLeaderId) {
        this.teamLeaderId = teamLeaderId;
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
    public void setZIPORPostalCode(String zIPORPostalCode) {
        ZIPORPostalCode = zIPORPostalCode;
    }

    
}
