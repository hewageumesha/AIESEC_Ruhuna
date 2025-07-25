package com.aiesec.repository.event;

import com.aiesec.model.event.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.time.LocalDate;
import java.util.List;
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Find events that start after a given date
    List<Event> findByStartDateAfter(LocalDate date);

    // Find public events that start after a given date
    List<Event> findByIsPublicTrueAndStartDateGreaterThanEqual(LocalDate date);

    // Find private events that start after a given date
    List<Event> findByIsPublicFalseAndStartDateGreaterThanEqual(LocalDate date);

    // Find all public events
    List<Event> findByIsPublicTrue();

    // Find all private events
    List<Event> findByIsPublicFalse();

    //Event search feature
    @Query("SELECT e FROM Event e " +
            "WHERE (:search IS NULL OR LOWER(e.eventName) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:date IS NULL OR e.startDate = :date) " +
            "AND (:status IS NULL OR " +
            "     (:status = 'upcoming' AND e.startDate >= CURRENT_DATE) OR " +
            "     (:status = 'past' AND e.startDate < CURRENT_DATE) OR " +
            "     (:status = 'public' AND e.isPublic = true) OR " +
            "     (:status = 'private' AND e.isPublic = false))")
    Page<Event> filterEvents(@Param("search") String search,
                             @Param("status") String status,
                             @Param("date") LocalDate date,
                             Pageable pageable);


    @Query("SELECT e.eventId, e.eventName, e.startDate FROM Event e")
    List<Object[]> findBasicEventInfo();


}