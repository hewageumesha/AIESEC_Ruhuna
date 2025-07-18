package com.aiesec.repository.event;

import com.aiesec.model.event.Merchandise;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface MerchandiseRepository extends JpaRepository<Merchandise, Long> {
    List<Merchandise> findByEventEventId(Long eventId);
    @Modifying
    @Transactional
    @Query("DELETE FROM Merchandise m WHERE m.event.eventId = :eventId")
    void deleteByEventId(@Param("eventId") Long eventId);
}
