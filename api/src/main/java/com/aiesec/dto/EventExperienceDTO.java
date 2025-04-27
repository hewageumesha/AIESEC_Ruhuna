package com.aiesec.dto;

public class EventExperienceDTO {
    private Long experienceId; // 🔥 You are missing this field
    private Long eventId;
    private Long userId;
    private Long guestUserId;
    private Integer rating;
    private String testimonial;
    // private LocalDateTime dateCreated; (if needed)

    // 👉 Getter and Setter for experienceId
    public Long getExperienceId() {
        return experienceId;
    }

    public void setExperienceId(Long experienceId) {
        this.experienceId = experienceId;
    }

    // 👉 Getters and Setters for other fields
    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getGuestUserId() {
        return guestUserId;
    }

    public void setGuestUserId(Long guestUserId) {
        this.guestUserId = guestUserId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getTestimonial() {
        return testimonial;
    }

    public void setTestimonial(String testimonial) {
        this.testimonial = testimonial;
    }

    // Add if you need dateCreated, etc.
}
