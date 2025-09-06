package com.aiesec.repository.event;

import com.aiesec.model.event.GuestEventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuestEventRegistrationRepository extends JpaRepository<GuestEventRegistration, Long> {
    boolean existsByEventIdAndEmail(Long eventId, String email);
    List<GuestEventRegistration> findByEventId(Long eventId);


}
