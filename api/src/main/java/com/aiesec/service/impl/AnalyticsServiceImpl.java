package com.aiesec.service.impl;


import com.aiesec.dto.RegistrationAnalyticsDTO;
import com.aiesec.dto.TrendDTO;
import com.aiesec.enums.InterestStatus;
import com.aiesec.model.User;
import com.aiesec.model.event.AiesecMemberEventRegistration;
import com.aiesec.model.event.GuestEventRegistration;
import com.aiesec.repository.event.AiesecMemberEventRegistrationRepository;
import com.aiesec.repository.event.EventRepository;
import com.aiesec.repository.event.GuestEventRegistrationRepository;
import com.aiesec.service.interfaces.AnalyticsService;
import org.springframework.stereotype.Service;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
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
    @Override
    public Map<String, Integer> getStatusDistribution(Long eventId, String type) {
        Map<String, Integer> statusCounts = new HashMap<>();

        if (type.equals("member") || type.equals("all")) {
            List<Object[]> memberStatusCounts = memberRepo.countByEventIdGroupByStatus(eventId);
            memberStatusCounts.forEach(row -> {
                String status = (String) row[0];
                int count = ((Number) row[1]).intValue();
                statusCounts.merge(status, count, Integer::sum);
            });
        }

        if (type.equals("guest") || type.equals("all")) {
            List<Object[]> guestStatusCounts = guestRepo.countByEventIdGroupByStatus(eventId);
            guestStatusCounts.forEach(row -> {
                String status = (String) row[0];
                int count = ((Number) row[1]).intValue();
                statusCounts.merge(status, count, Integer::sum);
            });
        }

        // If no registrations found for a status, ensure all statuses are present
        for (String status : List.of("Going", "Interested", "Not Going")) {
            statusCounts.putIfAbsent(status, 0);
        }

        return statusCounts;
    }

    @Override
    public void writeRegistrationsCsv(Writer writer, String type, Long eventId, String status) throws IOException {
        // Convert status string to InterestStatus enum
        InterestStatus interestStatus = null;
        if (status != null && !status.isBlank()) {
            try {
                interestStatus = InterestStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status: " + status);
            }
        }

        // Create CSV printer
        CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader(
                "Event ID", "Event Name", "Registrant Name", "Email", "Phone", "Interest Status", "Registration Type", "Registered At"
        ));

        // ===== AIESEC MEMBER REGISTRATIONS =====
        if (type.equals("member") || type.equals("all")) {
            List<AiesecMemberEventRegistration> memberRegs = memberRepo.findFiltered(eventId, interestStatus);
            for (AiesecMemberEventRegistration reg : memberRegs) {
                // Join with User table
                User user = reg.getUser();

                String name = user != null ? user.getUserName() + " " + user.getLastName() : "N/A";
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

        // ===== GUEST REGISTRATIONS =====
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
