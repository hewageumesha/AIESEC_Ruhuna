package com.aiesec.service.interfaces;

import com.aiesec.dto.GuestEventRegistrationDTO;
import com.aiesec.dto.GuestRegistrationSummaryDTO;

import java.util.List;
import java.util.Map;

public interface GuestEventRegistrationService {
    GuestEventRegistrationDTO register(GuestEventRegistrationDTO dto);
    List<GuestEventRegistrationDTO> getAllByEventId(Long eventId);
    List<GuestRegistrationSummaryDTO> getSummaryByEvent();
    Map<String, Integer> getStatusSummaryByEvent(Long eventId);


}
