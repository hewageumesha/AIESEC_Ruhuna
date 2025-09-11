package com.aiesec.model.event;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;


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

    @Column(name = "End_Date")
    private LocalDate endDate;

    @NotNull(message = "Event time is required")
    @Column(name = "Event_Time", nullable = false)
    private LocalTime eventTime;

    @Column(name = "End_Time")
    private LocalTime endTime;

    @Column(name = "registration_close_before_days")
    private Integer registrationCloseBeforeDays;


    @Column(name = "Location", length = 255)
    private String location;

    @Column(name = "Image_URL", length = 255)
    private String imageUrl;

    @Column(name = "Is_Public")
    private Boolean isPublic = false;

    @Column(name = "Is_Virtual")
    private Boolean isVirtual = false;

    @Column(name = "Virtual_Link", length = 500)
    private String virtualLink;

    @Column(name = "Has_Merchandise" ,nullable = false)
    private Boolean hasMerchandise = false;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Merchandise> merchandiseList = new ArrayList<>();

    public List<Merchandise> getMerchandiseList() {
        return merchandiseList;
    }

    public void setMerchandiseList(List<Merchandise> merchandiseList) {
        this.merchandiseList = merchandiseList;
    }

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

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalTime getEventTime() {
        return eventTime;
    }

    public void setEventTime(LocalTime eventTime) {
        this.eventTime = eventTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getPublic() {
        return isPublic;
    }

    public void setPublic(Boolean aPublic) {
        isPublic = aPublic;
    }

    public Boolean getVirtual() {
        return isVirtual;
    }

    public void setVirtual(Boolean virtual) {
        isVirtual = virtual;
    }

    public String getVirtualLink() {
        return virtualLink;
    }

    public void setVirtualLink(String virtualLink) {
        this.virtualLink = virtualLink;
    }

    public Boolean getHasMerchandise() {
        return hasMerchandise;
    }

    public Integer getRegistrationCloseBeforeDays() {
        return registrationCloseBeforeDays;
    }

    public void setRegistrationCloseBeforeDays(Integer registrationCloseBeforeDays) {
        this.registrationCloseBeforeDays = registrationCloseBeforeDays;
    }

    public void setHasMerchandise(Boolean hasMerchandise) {
        this.hasMerchandise = hasMerchandise;
    }

}