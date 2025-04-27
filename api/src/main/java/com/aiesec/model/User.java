package com.aiesec.model;

import com.aiesec.enums.UserRole;
import com.aiesec.enums.UserStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty
    private String firstName;

    @NotEmpty
    private String lastName;

    @NotEmpty
    private String email;

    @Email
    @NotEmpty
    private String aiesecEmail;

    @NotEmpty
    private String password;

    private LocalDate birthday;
    private LocalDate joinedDate;

    private String profilePicture;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.ACTIVE;

    @ManyToOne
    @JoinColumn(name = "function_id")
    private Function function;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @PrePersist
    public void prePersist() {
        if (this.password != null) {
            this.password = encodePassword(this.password);
        }
        if (this.profilePicture == null || this.profilePicture.isEmpty()) {
            this.profilePicture = "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-Clip-Art-Transparent-PNG.png";
        }
    }

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
}
