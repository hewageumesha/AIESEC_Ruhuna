package com.aiesec.service.impl;

import com.aiesec.dto.GuestEventRegistrationDTO;
import com.aiesec.dto.GuestRegistrationSummaryDTO;
import com.aiesec.mapper.GuestEventRegistrationMapper;
import com.aiesec.model.event.Event;
import com.aiesec.model.event.GuestEventRegistration;
import com.aiesec.repository.event.GuestEventRegistrationRepository;
import com.aiesec.repository.event.EventRepository;
import com.aiesec.service.interfaces.GuestEventRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GuestEventRegistrationServiceImpl implements GuestEventRegistrationService {

    private final GuestEventRegistrationRepository registrationRepository;
    private final EventRepository eventRepository; // ✅ Inject EventRepository

    @Override
    public GuestEventRegistrationDTO register(GuestEventRegistrationDTO dto) {
        System.out.println("Registering guest: " + dto);

        boolean exists = registrationRepository.existsByEvent_EventIdAndEmail(dto.getEventId(), dto.getEmail());
        if (exists) {
            throw new IllegalStateException("You have already registered for this event with this email.");
        }

        // ✅ Fetch event using EventRepository
        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // ✅ Registration closing logic
        LocalDateTime registrationCloseDate = event.getStartDate()
                .atStartOfDay()
                .minusDays(event.getRegistrationCloseBeforeDays());

        if (LocalDateTime.now().isAfter(registrationCloseDate)) {
            throw new IllegalStateException("Registrations are closed for this event.");
        }

        GuestEventRegistration entity = GuestEventRegistrationMapper.toEntity(dto);
        GuestEventRegistration saved = registrationRepository.save(entity);

        System.out.println("Saved entity: " + saved);
        return GuestEventRegistrationMapper.toDTO(saved);
    }

    @Override
    public List<GuestEventRegistrationDTO> getAllByEventId(Long eventId) {
        return registrationRepository.findByEvent_EventId(eventId)
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
    public Page<GuestEventRegistrationDTO> getPagedByEventId(Long eventId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("registeredAt").descending());
        Page<GuestEventRegistration> pageResult = registrationRepository.findByEvent_EventId(eventId, pageable);
        return pageResult.map(GuestEventRegistrationMapper::toDTO);
    }
}
