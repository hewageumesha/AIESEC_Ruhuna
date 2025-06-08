package com.aiesec.model.event;



import com.aiesec.model.User; 
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "event_experience")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventExperience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "experience_id")
    private Long experienceId;

    @ManyToOne
    @JoinColumn(name = "Event_ID", nullable = false)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "User_ID", referencedColumnName = "User_ID")
    private User user; // AIESEC member – nullable

    @ManyToOne
    @JoinColumn(name = "Guest_ID")
    private GuestUser guestUser; // Guest – nullable

    @Column(name = "Rating")
    private Integer rating; // 1 to 5 scale

    @Column(name = "Testimonial", columnDefinition = "TEXT")
    private String testimonial;

    //@Column(name = "date_created", nullable = false)
    //private LocalDate dateCreated;



}
