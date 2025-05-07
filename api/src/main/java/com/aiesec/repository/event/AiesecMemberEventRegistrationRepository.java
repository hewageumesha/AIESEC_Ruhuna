package com.aiesec.repository.event;

import com.aiesec.model.event.AiesecMemberEventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AiesecMemberEventRegistrationRepository  extends JpaRepository<AiesecMemberEventRegistration,Long> {
}

