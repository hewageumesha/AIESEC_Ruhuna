package com.aiesec.repository.event;

import com.aiesec.dto.EventRegistrationSummaryDTO;
import com.aiesec.enums.InterestStatus;
import com.aiesec.model.event.AiesecMemberEventRegistration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.time.LocalDateTime;
import java.util.List;

public interface AiesecMemberEventRegistrationRepository extends JpaRepository<AiesecMemberEventRegistration, Long> {

    // ✅ Fix: use event.eventId because event is an object
    boolean existsByUserIdAndEvent_EventId(Long userId, Long eventId);

    List<AiesecMemberEventRegistration> findByUserIdAndEvent_EventId(Long userId, Long eventId);

    Page<AiesecMemberEventRegistration> findByEvent_EventId(Long eventId, Pageable pageable);

    // ✅ Aggregated Summary using JPQL
    @Query("SELECT new com.aiesec.dto.EventRegistrationSummaryDTO(" +
            "r.event.eventId, r.event.eventName, COUNT(r)) " +
            "FROM AiesecMemberEventRegistration r " +
            "WHERE r.interestStatus = com.aiesec.enums.InterestStatus.GOING " +
            "GROUP BY r.event.eventId, r.event.eventName")
    List<EventRegistrationSummaryDTO> getGoingSummaryByEvent();


    int countByEvent_EventId(Long eventId);
    @Query("SELECT FUNCTION('DATE', r.registeredAt), COUNT(r) FROM AiesecMemberEventRegistration r " +
            "WHERE r.registeredAt BETWEEN :startDate AND :endDate " +
            "GROUP BY FUNCTION('DATE', r.registeredAt) ORDER BY FUNCTION('DATE', r.registeredAt)")
    List<Object[]> countRegistrationsGroupedByDate(@Param("startDate") LocalDateTime startDate,
                                                   @Param("endDate") LocalDateTime endDate);

    @Query("SELECT r.interestStatus, COUNT(r) FROM AiesecMemberEventRegistration r WHERE r.event.eventId = :eventId GROUP BY r.interestStatus")
    List<Object[]> countByEventIdGroupByStatus(@Param("eventId") Long eventId);

    @Query("SELECT r FROM AiesecMemberEventRegistration r WHERE " +
            "(:eventId IS NULL OR r.event.eventId = :eventId) AND " +
            "(:status IS NULL OR r.interestStatus = :status)")
    List<AiesecMemberEventRegistration> findFiltered(@Param("eventId") Long eventId, @Param("status") InterestStatus status);
}