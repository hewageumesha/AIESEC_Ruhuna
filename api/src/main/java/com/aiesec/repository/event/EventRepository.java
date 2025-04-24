package com.aiesec.repository.event;


import com.aiesec.model.event.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;


@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByStartDateAfter(LocalDate Date );
    List<Event> findByIsPublicTrueAndStartDateAfter(LocalDate Date );

}




