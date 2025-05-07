package com.aiesec.repository.event;

import com.aiesec.model.event.GuestEventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestEventRegistrationRepository extends JpaRepository<GuestEventRegistration, Long> {

}
