package com.aiesec.dto;



import java.sql.Date;

import com.aiesec.enums.Gender;
import com.aiesec.enums.UserRole;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequestDTO {
    private String aiesecEmail;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
    private Long functionId;
    private Long departmentId;
    private String teamLeaderAiesecEmail;
    private Gender gender;
    private Date birthday;
    private Date joinedDate;
}
