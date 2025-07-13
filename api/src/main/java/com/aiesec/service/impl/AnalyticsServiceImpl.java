package com.aiesec.service.impl;


import com.aiesec.dto.EventRegistrationSummaryDTO;
import com.aiesec.dto.GuestRegistrationSummaryDTO;
import com.aiesec.dto.RegistrationAnalyticsDTO;
import com.aiesec.dto.TrendDTO;
import com.aiesec.enums.InterestStatus;
import com.aiesec.model.User;
import com.aiesec.model.event.AiesecMemberEventRegistration;
import com.aiesec.model.event.Event;
import com.aiesec.model.event.GuestEventRegistration;
import com.aiesec.repository.event.AiesecMemberEventRegistrationRepository;
import com.aiesec.repository.event.EventRepository;
import com.aiesec.repository.event.GuestEventRegistrationRepository;
import com.aiesec.service.interfaces.AnalyticsService;
import com.aiesec.service.interfaces.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.Writer;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final EventRepository eventRepository;
    private final AiesecMemberEventRegistrationRepository memberRepo;
    private final GuestEventRegistrationRepository guestRepo;

    @Autowired
    private EventService eventService;

    public AnalyticsServiceImpl(EventRepository eventRepository,
                                AiesecMemberEventRegistrationRepository memberRepo,
                                GuestEventRegistrationRepository guestRepo) {
        this.eventRepository = eventRepository;
        this.memberRepo = memberRepo;
        this.guestRepo = guestRepo;
    }

    @Override
    public List<RegistrationAnalyticsDTO> getRegistrationsByEvent(String type, Long eventId) {
        List<RegistrationAnalyticsDTO> result = new ArrayList<>();

        if (eventId == null) {
            // All events: summarize GOING members + guests
            List<EventRegistrationSummaryDTO> memberSummaries = memberRepo.getGoingSummaryByEvent();
            List<GuestRegistrationSummaryDTO> guestSummaries = guestRepo.getGoingSummaryByEvent();

            // Map to combine data
            Map<Long, RegistrationAnalyticsDTO> map = new HashMap<>();

            for (EventRegistrationSummaryDTO dto : memberSummaries) {
                map.put(dto.getEventId(), new RegistrationAnalyticsDTO(
                        dto.getEventId(),
                        dto.getEventName(),
                        eventRepository.findById(dto.getEventId()).map(Event::getStartDate).orElse(null),
                        Math.toIntExact(dto.getGoingCount()),
                        0
                ));
            }

            for (GuestRegistrationSummaryDTO dto : guestSummaries) {
                map.computeIfAbsent(dto.getEventId(), id -> new RegistrationAnalyticsDTO(
                        dto.getEventId(),
                        dto.getEventName(),
                        eventRepository.findById(dto.getEventId()).map(Event::getStartDate).orElse(null),
                        0,
                        0
                )).setGuestRegistrations(Math.toIntExact(dto.getGoingCount()));
            }

            result = new ArrayList<>(map.values());
        } else {
            // Specific event selected
            int memberCount = type.equals("guest") ? 0 : memberRepo.findFiltered(eventId, InterestStatus.GOING).size();
            int guestCount = type.equals("member") ? 0 : guestRepo.findFiltered(eventId, InterestStatus.GOING).size();

            String eventName = eventRepository.findById(eventId)
                    .map(e -> e.getEventName())
                    .orElse("Unknown Event");

            LocalDate eventDate = eventRepository.findById(eventId)
                    .map(e -> e.getStartDate())
                    .orElse(null);

            result.add(new RegistrationAnalyticsDTO(
                    eventId,
                    eventName,
                    eventDate,
                    memberCount,
                    guestCount
            ));
        }

        return result.stream()
                .sorted(Comparator.comparing(RegistrationAnalyticsDTO::getEventDate, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getAllEventsForAnalytics() {
        List<Event> events = eventRepository.findAll();

        return events.stream().map(event -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", event.getEventId());
            map.put("name", event.getEventName());
            map.put("isPublic", event.getIsPublic());
            return map;
        }).collect(Collectors.toList());
    }



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
            LocalDate date = ((java.sql.Date) row[0]).toLocalDate();
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

    @Override
    public Map<String, Integer> getStatusDistribution(Long eventId, String type) {
        Map<String, Integer> statusCounts = new HashMap<>();

        if (type.equals("member") || type.equals("all")) {
            List<Object[]> memberStatusCounts = memberRepo.countByEventIdGroupByStatus(eventId);
            memberStatusCounts.forEach(row -> {
                InterestStatus status = (InterestStatus) row[0];
                int count = ((Number) row[1]).intValue();
                statusCounts.merge(status.name(), count, Integer::sum);
            });
        }

        if (type.equals("guest") || type.equals("all")) {
            List<Object[]> guestStatusCounts = guestRepo.countByEventIdGroupByStatus(eventId);
            guestStatusCounts.forEach(row -> {
                InterestStatus status = (InterestStatus) row[0];
                int count = ((Number) row[1]).intValue();
                statusCounts.merge(status.name(), count, Integer::sum);
            });
        }

        for (InterestStatus status : InterestStatus.values()) {
            statusCounts.putIfAbsent(status.name(), 0);
        }

        return statusCounts;
    }

    @Override
    public void writeRegistrationsCsv(Writer writer, String type, Long eventId, String status) throws IOException {
        InterestStatus interestStatus = null;
        if (status != null && !status.isBlank()) {
            try {
                interestStatus = InterestStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status: " + status);
            }
        }

        CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader(
                "Event ID", "Event Name", "Registrant Name", "Email", "Phone", "Interest Status", "Registration Type", "Registered At"
        ));

        if (type.equals("member") || type.equals("all")) {
            List<AiesecMemberEventRegistration> memberRegs = memberRepo.findFiltered(eventId, interestStatus);
            for (AiesecMemberEventRegistration reg : memberRegs) {
                User user = reg.getUser();

                String name = user != null ? user.getFirstName() + " " + user.getLastName() : "N/A";
                String email = user != null ? user.getEmail() : "N/A";
                String phone = user != null ? user.getPhoneNumber() : "N/A";

                csvPrinter.printRecord(
                        reg.getEvent().getEventId(),
                        reg.getEvent().getEventName(),
                        name,
                        email,
                        phone,
                        reg.getInterestStatus().toString(),
                        "Member",
                        reg.getRegisteredAt()
                );
            }
        }

        if (type.equals("guest") || type.equals("all")) {
            List<GuestEventRegistration> guestRegs = guestRepo.findFiltered(eventId, interestStatus);
            for (GuestEventRegistration reg : guestRegs) {
                csvPrinter.printRecord(
                        reg.getEvent().getEventId(),
                        reg.getEvent().getEventName(),
                        reg.getName(),
                        reg.getEmail(),
                        reg.getPhone(),
                        reg.getInterestStatus().toString(),
                        "Guest",
                        reg.getRegisteredAt()
                );
            }
        }

        csvPrinter.flush();
    }
}