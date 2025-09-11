package com.aiesec.dto;

import java.sql.Date;
import java.util.List;

import com.aiesec.enums.Gender;
import com.aiesec.enums.UserRole;
import com.aiesec.enums.UserStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
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
    private String s_department;
    private String faculty;
    private Date birthday;
    private Gender gender;
    private Date joinedDate;
    private String profilePicture;
    private UserRole role;
    private UserStatus status;
    private FunctionDTO functionId;  
    private String functionName; 
    private DepartmentDTO departmentId;  
    private String departmentName;    
    private String teamLeaderAiesecEmail;
    private String teamLeaderName;
    @JsonIgnore
    private List<UserDTO> teamMembers;
    private List<String> commentsForUser; 
    private List<String> commentsCreated; 
    private int noOfTask;

}

