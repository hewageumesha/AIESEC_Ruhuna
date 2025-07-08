package com.aiesec.service.impl;


import com.aiesec.dto.RegistrationAnalyticsDTO;
import com.aiesec.dto.TrendDTO;
import com.aiesec.repository.event.AiesecMemberEventRegistrationRepository;
import com.aiesec.repository.event.EventRepository;
import com.aiesec.repository.event.GuestEventRegistrationRepository;
import com.aiesec.service.interfaces.AnalyticsService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final EventRepository eventRepository;
    private final AiesecMemberEventRegistrationRepository memberRepo;
    private final GuestEventRegistrationRepository guestRepo;

    public AnalyticsServiceImpl(EventRepository eventRepository,
                                AiesecMemberEventRegistrationRepository memberRepo,
                                GuestEventRegistrationRepository guestRepo) {
        this.eventRepository = eventRepository;
        this.memberRepo = memberRepo;
        this.guestRepo = guestRepo;
    }

    @Override
    public List<RegistrationAnalyticsDTO> getRegistrationsByEvent(String type) {
        List<Object[]> eventData = eventRepository.findBasicEventInfo(); // [id, name, date]

        List<RegistrationAnalyticsDTO> result = new ArrayList<>();

        for (Object[] row : eventData) {
            Long eventId = (Long) row[0];
            String eventName = (String) row[1];
            LocalDate eventDate = (LocalDate) row[2];

            int memberCount = type.equals("guest") ? 0 : memberRepo.countByEvent_EventId(eventId);
            int guestCount = type.equals("member") ? 0 : guestRepo.countByEvent_EventId(eventId);

            result.add(new RegistrationAnalyticsDTO(
                    eventId, eventName, eventDate, memberCount, guestCount
            ));
        }

        return result.stream()
                .sorted(Comparator.comparing(RegistrationAnalyticsDTO::getEventDate).reversed())
                .collect(Collectors.toList());
    }  // <-- close this method properly

    @Override
    public List<TrendDTO> getTrendData(String type, int days) {
        LocalDateTime endDateTime = LocalDate.now().atTime(23, 59, 59);
        LocalDateTime startDateTime = LocalDate.now().minusDays(days).atStartOfDay();

        Map<LocalDate, TrendDTO> dateMap = new LinkedHashMap<>();
        for (LocalDate date = startDateTime.toLocalDate(); !date.isAfter(endDateTime.toLocalDate()); date = date.plusDays(1)) {
            dateMap.put(date, new TrendDTO(date, 0, 0));
        }

        List<Object[]> memberCounts = Collections.emptyList();
        List<Object[]> guestCounts = Collections.emptyList();

        if (!type.equals("guest")) {
            memberCounts = memberRepo.countRegistrationsGroupedByDate(startDateTime, endDateTime);
        }
        if (!type.equals("member")) {
            guestCounts = guestRepo.countRegistrationsGroupedByDate(startDateTime, endDateTime);
        }

        for (Object[] row : memberCounts) {
            LocalDate date = ((java.sql.Date) row[0]).toLocalDate();  // sometimes you get java.sql.Date
            int count = ((Number) row[1]).intValue();

            TrendDTO dto = dateMap.get(date);
            if (dto != null) {
                dto.setMemberRegistrations(count);
            }
        }

        for (Object[] row : guestCounts) {
            LocalDate date = ((java.sql.Date) row[0]).toLocalDate();
            int count = ((Number) row[1]).intValue();

            TrendDTO dto = dateMap.get(date);
            if (dto != null) {
                dto.setGuestRegistrations(count);
            }
        }

        return new ArrayList<>(dateMap.values());
    }
}
