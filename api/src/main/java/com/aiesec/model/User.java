package com.aiesec.model;


import com.aiesec.enums.UserRole;
import com.aiesec.enums.UserStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "User_ID")
    private Long userId;

    @NotEmpty
    @Column(name = "First_Name", nullable = false, length = 100)
    private String firstName;

    @NotEmpty
    @Column(name = "Last_Name", nullable = false, length = 100)
    private String lastName;

    @Email
    @NotEmpty
    @Column(name = "Email", nullable = false, unique = true, length = 150)
    private String email;

    @NotEmpty
    @Email
    @Column(name = "AIESEC_Email", nullable = false, unique = true, length = 150)
    private String aiesecEmail;

    @Column(name = "Phone_Number", length = 20)
    private String phoneNumber;

    @NotEmpty
    @Column(name = "Password", nullable = false, length = 255)
    private String password;

    @Column(name = "Profile_Photo", length = 255)
    @ColumnDefault("https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-Clip-Art-Transparent-PNG.png")
    private String profilePicture;

    @Column(name = "Birthday", nullable = false)
    private LocalDate birthday;

    @Column(name = "Date_Joined", nullable = false)
    private LocalDate joinedDate;


    @Enumerated(EnumType.STRING)
    @Column(name = "Role", nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private UserStatus status;

    @ManyToOne
    @JoinColumn(name="function_id")
    private Function function;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;


    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public LocalDate getBirthday() {
        return birthday;
    }

    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
    }

    public LocalDate getJoinedDate() {
        return joinedDate;
    }

    public void setJoinedDate(LocalDate joinedDate) {
        this.joinedDate = joinedDate;
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

    public Function getFunction() {
        return function;
    }

    public void setFunction(Function function) {
        this.function = function;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }
}
