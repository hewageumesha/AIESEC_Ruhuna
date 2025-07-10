package com.aiesec.repository.event;

import com.aiesec.model.event.Merchandise;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MerchandiseRepository extends JpaRepository<Merchandise, Long> {
    List<Merchandise> findByEventEventId(Long eventId);
    void deleteByEventEventId(Long eventId);



}
