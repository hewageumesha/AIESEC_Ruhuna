package com.aiesec.repository.event;

import com.aiesec.model.event.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Find events that start after a given date
    List<Event> findByStartDateAfter(LocalDate date);

    // Find public events that start after a given date
    List<Event> findByIsPublicTrueAndStartDateAfter(LocalDate date);

    // Find events with a t-shirt order option, starting after a given date
    List<Event> findByHasTshirtOrderTrueAndStartDateAfter(LocalDate date);

    // Find events based on visibility and starting date
    List<Event> findByVisibilityAndStartDateAfter(String visibility, LocalDate date);

    // Find events with t-shirt orders, based on visibility, and starting after a given date
    List<Event> findByHasTshirtOrderTrueAndVisibilityAndStartDateAfter(String visibility, LocalDate date);

    // Optionally, find all events that have a t-shirt order regardless of the start date
    List<Event> findByHasTshirtOrderTrue();

    // Optionally, find events with a specific visibility
    List<Event> findByVisibility(String visibility);
}
