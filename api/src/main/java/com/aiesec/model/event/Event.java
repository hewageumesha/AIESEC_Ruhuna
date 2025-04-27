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

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalTime getEventTime() {
        return eventTime;
    }

    public void setEventTime(LocalTime eventTime) {
        this.eventTime = eventTime;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Boolean getPublic() {
        return isPublic;
    }

    public void setPublic(Boolean aPublic) {
        isPublic = aPublic;
    }

    public User getLcp() {
        return lcp;
    }

    public void setLcp(User lcp) {
        this.lcp = lcp;
    }

    public User getLcvp() {
        return lcvp;
    }

    public void setLcvp(User lcvp) {
        this.lcvp = lcvp;
    }

    public EventSeries getSeries() {
        return series;
    }

    public void setSeries(EventSeries series) {
        this.series = series;
    }

    public User getCreatedByLcp() {
        return createdByLcp;
    }

    public void setCreatedByLcp(User createdByLcp) {
        this.createdByLcp = createdByLcp;
    }

    public User getApprovedByLcvp() {
        return approvedByLcvp;
    }

    public void setApprovedByLcvp(User approvedByLcvp) {
        this.approvedByLcvp = approvedByLcvp;
    }

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