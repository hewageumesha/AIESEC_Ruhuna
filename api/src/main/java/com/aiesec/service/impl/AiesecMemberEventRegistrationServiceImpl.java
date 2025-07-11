package com.aiesec.service.impl;

import com.aiesec.dto.AiesecMemberEventRegistrationDTO;
import com.aiesec.dto.EventRegistrationSummaryDTO;
import com.aiesec.dto.RegistrationDTO;
import com.aiesec.mapper.AiesecMemberEventRegistrationMapper;
import com.aiesec.model.event.AiesecMemberEventRegistration;
import com.aiesec.repository.event.AiesecMemberEventRegistrationRepository;
import com.aiesec.service.interfaces.AiesecMemberEventRegistrationService;
import lombok.RequiredArgsConstructor;
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
        return registrationRepository.findByUserIdAndEventId(userId, eventId)
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
        System.out.println("DB results for status summary: " + results);  // debug log

        Map<String, Integer> summary = new HashMap<>();
        summary.put("GOING", 0);
        summary.put("PENDING", 0);
        summary.put("NOT_GOING", 0);

        for (Object[] row : results) {
            String status = row[0].toString();
            Number count = (Number) row[1];
            summary.put(status, count.intValue());

            summary.put(status, count.intValue());
        }

        System.out.println("Summary map: " + summary); // debug log

        return summary;
    }

    @Override
    public AiesecMemberEventRegistration updateRegistration(Long id, RegistrationDTO dto) {
        AiesecMemberEventRegistration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        // Optional: validate that the dto.userId matches the owner
        if (!registration.getUserId().equals(dto.getUserId())) {
            throw new RuntimeException("You are not authorized to update this registration");
        }

        registration.setInterestStatus(dto.getInterestStatus());
        registration.setComment(dto.getComment());

        return registrationRepository.save(registration);
    }

}
