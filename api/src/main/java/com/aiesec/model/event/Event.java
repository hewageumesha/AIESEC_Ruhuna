package com.aiesec.model.event;



import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import com.aiesec.model.User; 

import java.time.LocalDate;
import java.time.LocalTime;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "event")

public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="Event_ID")
    private Long eventId;



    @NotBlank(message = "Event name is required")
    @Column(name = "Event_Name", nullable = false, length = 200)
    private String eventName;

    @NotBlank(message = "Description is required")
    @Column(name = "Descriptions", nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Start date is required")
    @Column(name = "Start_Date", nullable = false)
    private LocalDate startDate;


    @NotNull(message = "Event time is required")
    @Column(name = "Event_Time", nullable = false)
    private LocalTime eventTime;

    @NotBlank(message = "Location is required")
    @Column(name = "Location", nullable = false, length = 255)
    private String location;

    @Column(name = "Image_URL", length = 255)
    private String imageUrl;

    @Column(name = "Is_Public")
    private Boolean isPublic = false;

     //Foreign Key Relations (assuming LCP and LCVP are users)
    @ManyToOne
    @JoinColumn(name = "LCP_ID")
    private User lcp;

    @ManyToOne
    @JoinColumn(name = "LCVP_ID")
   private User lcvp;

    @ManyToOne
   @JoinColumn(name = "Series_ID")
    private EventSeries series;

   @ManyToOne
   @JoinColumn(name = "Created_By_LCP")
    private User createdByLcp;

    @ManyToOne
   @JoinColumn(name = "Approved_By_LCVP")
   private User approvedByLcvp;
}