package com.example.EventManagement.entity;

import com.example.EventManagement.enums.UserRole;
import com.example.EventManagement.enums.UserStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
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
    private String profilePicture;

    @Column(name = "Birthday", nullable = false)
    private LocalDate birthday;

    @Column(name = "Date_Joined", nullable = false)
    private LocalDate joinedDate;

    @Column(name = "Assigned_Team", nullable = false, length = 255)
    private String assignedTeam;

    @Enumerated(EnumType.STRING)
    @Column(name = "Role", nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private UserStatus status = UserStatus.ACTIVE;

    // Optional: Add getter for full name if needed
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
