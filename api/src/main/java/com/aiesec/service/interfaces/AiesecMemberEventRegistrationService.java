package com.aiesec.service.interfaces;

import com.aiesec.dto.AiesecMemberEventRegistrationDTO;
import com.aiesec.dto.EventRegistrationSummaryDTO;

import java.util.List;
import java.util.Map;

public interface AiesecMemberEventRegistrationService {
    AiesecMemberEventRegistrationDTO register(AiesecMemberEventRegistrationDTO dto);
    List<AiesecMemberEventRegistrationDTO> getByUserIdAndEventId(Long userId, Long eventId);
    boolean alreadyRegistered(Long userId, Long eventId);
    List<AiesecMemberEventRegistrationDTO> getByEventId(Long eventId);
    List<EventRegistrationSummaryDTO> getSummaryByEvent();
    Map<String, Integer> getStatusSummaryByEvent(Long eventId);


}
