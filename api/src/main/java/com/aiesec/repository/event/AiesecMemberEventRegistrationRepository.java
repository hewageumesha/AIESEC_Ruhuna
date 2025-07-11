package com.aiesec.repository.event;

import com.aiesec.model.event.AiesecMemberEventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AiesecMemberEventRegistrationRepository  extends JpaRepository<AiesecMemberEventRegistration,Long> {
    boolean existsByUserIdAndEventId(Long userId, Long eventId);
    List<AiesecMemberEventRegistration> findByUserIdAndEventId(Long userId, Long eventId);
}

