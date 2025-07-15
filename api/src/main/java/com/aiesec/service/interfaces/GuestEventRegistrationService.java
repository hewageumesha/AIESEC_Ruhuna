package com.aiesec.service.interfaces;

import com.aiesec.dto.GuestEventRegistrationDTO;
import com.aiesec.dto.GuestRegistrationSummaryDTO;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface GuestEventRegistrationService {
    GuestEventRegistrationDTO register(GuestEventRegistrationDTO dto);
    List<GuestEventRegistrationDTO> getAllByEventId(Long eventId);
    List<GuestRegistrationSummaryDTO> getSummaryByEvent();
    Map<String, Integer> getStatusSummaryByEvent(Long eventId);
    Page<GuestEventRegistrationDTO> getPagedByEventId(Long eventId, int page, int size);



}
