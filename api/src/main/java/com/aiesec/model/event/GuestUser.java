package com.aiesec.model.event;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "guest_users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuestUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Guest_ID")
    private Long guestUserId;

    @Column(name = "Full_Name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "Email", nullable = false, length = 150, unique = true)
    private String email;

    @Column(name = "Contact_Number", length = 20)
    private String contactNumber;
}

