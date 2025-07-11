package com.aiesec.repository.event;

import com.aiesec.model.event.GuestEventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuestEventRegistrationRepository extends JpaRepository<GuestEventRegistration, Long> {
    boolean existsByEvent_EventIdAndEmail(Long eventId, String email);
    List<GuestEventRegistration> findByEvent_EventId(Long eventId);
    @Query("SELECT new com.aiesec.dto.GuestRegistrationSummaryDTO(" +
            "g.event.eventId, g.event.eventName, COUNT(g)) " +
            "FROM GuestEventRegistration g " +
            "WHERE g.interestStatus = com.aiesec.enums.InterestStatus.GOING " +
            "GROUP BY g.event.eventId, g.event.eventName")
    List<GuestRegistrationSummaryDTO> getGoingSummaryByEvent();


    int countByEvent_EventId(Long eventId);

    @Query("SELECT FUNCTION('DATE', r.registeredAt), COUNT(r) FROM GuestEventRegistration r " +
            "WHERE r.registeredAt BETWEEN :startDate AND :endDate " +
            "GROUP BY FUNCTION('DATE', r.registeredAt) ORDER BY FUNCTION('DATE', r.registeredAt)")
    List<Object[]> countRegistrationsGroupedByDate(@Param("startDate") LocalDateTime startDate,
                                                   @Param("endDate") LocalDateTime endDate);

    @Query("SELECT r.interestStatus, COUNT(r) FROM GuestEventRegistration r WHERE r.event.eventId = :eventId GROUP BY r.interestStatus")
    List<Object[]> countByEventIdGroupByStatus(@Param("eventId") Long eventId);


    @Query("SELECT r FROM GuestEventRegistration r WHERE " +
            "(:eventId IS NULL OR r.event.eventId = :eventId) AND " +
            "(:status IS NULL OR r.interestStatus = :status)")
    List<GuestEventRegistration> findFiltered(@Param("eventId") Long eventId,
                                              @Param("status") InterestStatus status);






}
