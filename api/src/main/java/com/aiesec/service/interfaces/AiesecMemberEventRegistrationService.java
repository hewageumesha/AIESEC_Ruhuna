package com.aiesec.service.interfaces;

import com.aiesec.dto.AiesecMemberEventRegistrationDTO;

import java.util.List;

public interface AiesecMemberEventRegistrationService {
    AiesecMemberEventRegistrationDTO register(AiesecMemberEventRegistrationDTO dto);
    List<AiesecMemberEventRegistrationDTO> getByUserIdAndEventId(Long userId, Long eventId);
    boolean alreadyRegistered(Long userId, Long eventId);
}
