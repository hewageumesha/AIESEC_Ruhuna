package com.aiesec.service.interfaces;

import com.aiesec.dto.GuestEventRegistrationDTO;
import com.aiesec.dto.GuestRegistrationSummaryDTO;

import java.util.List;

public interface GuestEventRegistrationService {
    GuestEventRegistrationDTO register(GuestEventRegistrationDTO dto);
    List<GuestEventRegistrationDTO> getAllByEventId(Long eventId);
    List<GuestRegistrationSummaryDTO> getSummaryByEvent();

}
