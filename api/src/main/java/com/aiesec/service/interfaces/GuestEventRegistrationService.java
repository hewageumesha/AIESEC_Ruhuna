package com.aiesec.service.interfaces;

import com.aiesec.dto.GuestEventRegistrationDTO;

import java.util.List;

public interface GuestEventRegistrationService {
    GuestEventRegistrationDTO register(GuestEventRegistrationDTO dto);
    List<GuestEventRegistrationDTO> getAllByEventId(Long eventId);
}
