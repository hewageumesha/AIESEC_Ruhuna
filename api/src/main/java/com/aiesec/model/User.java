package com.aiesec.model;

import com.aiesec.enums.Gender;
import com.aiesec.enums.UserRole;
import com.aiesec.enums.UserStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDate;
import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
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
    private LocalDate birthday;

    private Gender gender;

    @Temporal(TemporalType.DATE)
    private LocalDate joinedDate;

    private String profilePicture;

    private String about;

    private String phone;

    private String streetAddress;

    private String city;

    private String stateORProvince;

    private String ZIPORPostalCode;

    private String teamLeaderAiesecEmail;

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    //public Date getBirthday() {
      //  return birthday;
    //}

    //public void setBirthday(Date birthday) {
       // this.birthday = birthday;
   // }

    //public Date getJoinedDate() {
    //    return joinedDate;
   // }

    //public void setJoinedDate(Date joinedDate) {
     //   this.joinedDate = joinedDate;
   // }

    public List<Comment> getCommentsForUser() {
        return commentsForUser;
    }

    public void setCommentsForUser(List<Comment> commentsForUser) {
        this.commentsForUser = commentsForUser;
    }

    public List<Comment> getCommentsCreated() {
        return commentsCreated;
    }

    public void setCommentsCreated(List<Comment> commentsCreated) {
        this.commentsCreated = commentsCreated;
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

    public String getTeamLeaderAiesecEmail() {
        return teamLeaderAiesecEmail;
    }

    public void setTeamLeaderAiesecEmail(String teamLeaderAiesecEmail) {
        teamLeaderAiesecEmail = teamLeaderAiesecEmail;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
        public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
