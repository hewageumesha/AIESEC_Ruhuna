package com.aiesec.dto;

import java.util.Date;

public class BirthdayDTO {
    private Long userId;  
    private String name;
    private Date birthday; 
    private String profilePicture;

    // No-args constructor for Spring
    public BirthdayDTO() {}

    // All-args constructor
    public BirthdayDTO(Long userId, String name, Date birthday, String profilePicture) {
        this.userId = userId;
        this.name = name;
        this.birthday = birthday;
        this.profilePicture = profilePicture;
    }

    // Getters
    public Long getUserId() { return userId; }
    public String getName() { return name; }
    public Date getBirthday() { return birthday; }
    public String getProfilePicture() { return profilePicture; }

    // Setters
    public void setUserId(Long userId) { this.userId = userId; }
    public void setName(String name) { this.name = name; }
    public void setBirthday(Date birthday) { this.birthday = birthday; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
}
