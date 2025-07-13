package com.aiesec.service.impl;

import com.aiesec.dto.GuestEventRegistrationDTO;
import com.aiesec.mapper.GuestEventRegistrationMapper;
import com.aiesec.model.event.GuestEventRegistration;
import com.aiesec.repository.event.GuestEventRegistrationRepository;
import com.aiesec.service.interfaces.GuestEventRegistrationService;
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
public class GuestEventRegistrationServiceImpl implements GuestEventRegistrationService {

    private final GuestEventRegistrationRepository registrationRepository;

    @Override
    public GuestEventRegistrationDTO register(GuestEventRegistrationDTO dto) {
        boolean exists = registrationRepository.existsByEventIdAndEmail(dto.getEventId(), dto.getEmail());
        if (exists) {
            throw new IllegalStateException("You have already registered for this event with this email.");
        }

        GuestEventRegistration entity = GuestEventRegistrationMapper.toEntity(dto);
        GuestEventRegistration saved = registrationRepository.save(entity);
        return GuestEventRegistrationMapper.toDTO(saved);
    }

    @Override
    public List<GuestEventRegistrationDTO> getAllByEventId(Long eventId) {
        return registrationRepository.findByEventId(eventId)
                .stream()
                .map(GuestEventRegistrationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<GuestRegistrationSummaryDTO> getSummaryByEvent() {
        return registrationRepository.getGoingSummaryByEvent();
    }

    @Override
    public Map<String, Integer> getStatusSummaryByEvent(Long eventId) {
        List<Object[]> results = registrationRepository.countByEventIdGroupByStatus(eventId);
        System.out.println("DB results for guest status summary: " + results);  // optional debug log

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

        System.out.println("Guest summary map: " + summary); // optional debug log

        return summary;
    }


    @Override
    public Page<GuestEventRegistrationDTO> getPagedByEventId(Long eventId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("registeredAt").descending());
        Page<GuestEventRegistration> pageResult = registrationRepository.findByEvent_EventId(eventId, pageable);
        return pageResult.map(GuestEventRegistrationMapper::toDTO);
    }



}
