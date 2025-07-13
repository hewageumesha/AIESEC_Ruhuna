package com.aiesec.service.impl;

import com.aiesec.dto.AiesecMemberEventRegistrationDTO;
import com.aiesec.dto.EventRegistrationSummaryDTO;
import com.aiesec.dto.RegistrationDTO;
import com.aiesec.mapper.AiesecMemberEventRegistrationMapper;
import com.aiesec.model.event.AiesecMemberEventRegistration;
import com.aiesec.repository.event.AiesecMemberEventRegistrationRepository;
import com.aiesec.service.interfaces.AiesecMemberEventRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class AiesecMemberEventRegistrationServiceImpl implements AiesecMemberEventRegistrationService {

    private final AiesecMemberEventRegistrationRepository registrationRepository;

    @Override
    public AiesecMemberEventRegistrationDTO register(AiesecMemberEventRegistrationDTO dto) {
        if (registrationRepository.existsByUserIdAndEventId(dto.getUserId(), dto.getEventId())) {
            throw new IllegalStateException("User with ID " + dto.getUserId() + " is already registered for event ID " + dto.getEventId());
        }

        AiesecMemberEventRegistration entity = AiesecMemberEventRegistrationMapper.toEntity(dto);
        AiesecMemberEventRegistration saved = registrationRepository.save(entity);
        return AiesecMemberEventRegistrationMapper.toDTO(saved);
    }

    @Override
    public List<AiesecMemberEventRegistrationDTO> getByUserIdAndEventId(Long userId, Long eventId) {
        return registrationRepository.findByUserIdAndEvent_EventId(userId, eventId)
                .stream()
                .map(AiesecMemberEventRegistrationMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Updated method to handle pageable properly and fix missing pageable param
    @Override
    public List<AiesecMemberEventRegistrationDTO> getByEventId(Long eventId) {
        // Use default Pageable if you want, or change method signature to accept pageable
        Pageable pageable = PageRequest.of(0, 1000, Sort.by("registeredAt").descending()); // default paging if you want
        return registrationRepository.findByEvent_EventId(eventId, pageable)
                .stream()
                .map(AiesecMemberEventRegistrationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventRegistrationSummaryDTO> getSummaryByEvent() {
        return registrationRepository.getGoingSummaryByEvent();
    }

    @Override
    public boolean alreadyRegistered(Long userId, Long eventId) {
        return registrationRepository.existsByUserIdAndEvent_EventId(userId, eventId);
    }

    @Override
    public Map<String, Integer> getStatusSummaryByEvent(Long eventId) {
        List<Object[]> results = registrationRepository.countByEventIdGroupByStatus(eventId);

        Map<String, Integer> summary = new HashMap<>();
        summary.put("GOING", 0);
        summary.put("PENDING", 0);
        summary.put("NOT_GOING", 0);

        for (Object[] row : results) {
            String status = row[0].toString();
            Number count = (Number) row[1];
            summary.put(status, count.intValue());
        }

        return summary;
    }

    @Override
    public AiesecMemberEventRegistration updateRegistration(Long id, RegistrationDTO dto) {
        AiesecMemberEventRegistration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        if (!registration.getUserId().equals(dto.getUserId())) {
            throw new RuntimeException("You are not authorized to update this registration");
        }

        registration.setInterestStatus(dto.getInterestStatus());
        registration.setComment(dto.getComment());

        return registrationRepository.save(registration);
    }

    @Override
    public Page<AiesecMemberEventRegistrationDTO> getPagedByEventId(Long eventId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("registeredAt").descending());
        Page<AiesecMemberEventRegistration> registrations = registrationRepository.findByEvent_EventId(eventId, pageable);
        return registrations.map(AiesecMemberEventRegistrationMapper::toDTO);
    }
}
