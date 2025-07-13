package com.aiesec.service.interfaces;

import com.aiesec.dto.AiesecMemberEventRegistrationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import com.aiesec.dto.EventRegistrationSummaryDTO;
import com.aiesec.dto.RegistrationDTO;
import com.aiesec.model.event.AiesecMemberEventRegistration;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface AiesecMemberEventRegistrationService {
    AiesecMemberEventRegistrationDTO register(AiesecMemberEventRegistrationDTO dto);
    List<AiesecMemberEventRegistrationDTO> getByUserIdAndEventId(Long userId, Long eventId);
    boolean alreadyRegistered(Long userId, Long eventId);
    List<AiesecMemberEventRegistrationDTO> getByEventId(Long eventId);
    List<EventRegistrationSummaryDTO> getSummaryByEvent();
    Map<String, Integer> getStatusSummaryByEvent(Long eventId);
    @Transactional
    AiesecMemberEventRegistration updateRegistration(Long id, RegistrationDTO dto);
    Page<AiesecMemberEventRegistrationDTO> getPagedByEventId(Long eventId, int page, int size);





}
