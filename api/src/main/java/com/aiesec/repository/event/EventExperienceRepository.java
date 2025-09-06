package com.aiesec.repository.event;



import com.aiesec.model.event.EventExperience;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventExperienceRepository extends JpaRepository<EventExperience, Long> {

    List<EventExperience> findByEvent_EventId(Long eventId);
    List<EventExperience> findByUser_Id(Long userId);
}

