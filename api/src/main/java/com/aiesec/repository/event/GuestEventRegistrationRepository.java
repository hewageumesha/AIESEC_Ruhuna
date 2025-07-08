package com.aiesec.repository.event;

import com.aiesec.dto.GuestRegistrationSummaryDTO;
import com.aiesec.model.event.GuestEventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface GuestEventRegistrationRepository extends JpaRepository<GuestEventRegistration, Long> {
    boolean existsByEvent_EventIdAndEmail(Long eventId, String email);
    List<GuestEventRegistration> findByEvent_EventId(Long eventId);
    @Query("SELECT new com.aiesec.dto.GuestRegistrationSummaryDTO(" +
            "g.event.eventId, " +
            "g.event.eventName, " +
            "COUNT(g), " +
            "SUM(CASE WHEN g.interestStatus = com.aiesec.enums.InterestStatus.GOING THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN g.interestStatus = com.aiesec.enums.InterestStatus.PENDING THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN g.interestStatus = com.aiesec.enums.InterestStatus.NOT_GOING THEN 1 ELSE 0 END)) " +
            "FROM GuestEventRegistration g " +
            "GROUP BY g.event.eventId, g.event.eventName")
    List<GuestRegistrationSummaryDTO> getGuestSummaryByEvent();

    int countByEvent_EventId(Long eventId);

    @Query("SELECT FUNCTION('DATE', r.registeredAt), COUNT(r) FROM GuestEventRegistration r " +
            "WHERE r.registeredAt BETWEEN :startDate AND :endDate " +
            "GROUP BY FUNCTION('DATE', r.registeredAt) ORDER BY FUNCTION('DATE', r.registeredAt)")
    List<Object[]> countRegistrationsGroupedByDate(@Param("startDate") LocalDateTime startDate,
                                                   @Param("endDate") LocalDateTime endDate);





}
