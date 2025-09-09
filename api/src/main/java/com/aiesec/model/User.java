package com.aiesec.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.aiesec.enums.Gender;
import com.aiesec.enums.UserRole;
import com.aiesec.enums.UserStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty
    private String firstName;

    @NotEmpty
    private String lastName;

    @Email
    @NotEmpty
    private String email;

    @Email
    @NotEmpty
    private String aiesecEmail;

    @NotEmpty
    private String password;

    @Temporal(TemporalType.DATE)
    private Date birthday;

    private Gender gender;

    @Temporal(TemporalType.DATE)
    private Date joinedDate;

    private String profilePicture;

    private String phoneNumber;

    private String streetAddress;

    private String city;

    private String stateORProvince;

    private String ZIPORPostalCode;

    private String teamLeaderAiesecEmail;

    private String teamLeaderId;

    private String s_department;

    private String faculty;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @ManyToOne
    @JoinColumn(name = "function_id")
    private Function function;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @OneToMany(mappedBy = "member")
    private List<Comment> commentsForUser;

    @OneToMany(mappedBy = "createdBy")
    private List<Comment> commentsCreated;

    @PrePersist
    public void prePersist() {
        if (this.password != null) {
            this.password = encodePassword(this.password);  // Automatically encode password before persisting
        }
    }

    private String encodePassword(String rawPassword) {
        // Assuming you have access to a password encoder here, you could inject it or use it statically
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.encode(rawPassword);
    }

    @OneToOne(mappedBy = "user")
    @JsonIgnore
    private ForgotPassword forgotPassword;
}