package com.aiesec.repository.event;


import com.aiesec.model.event.Event;
import com.aiesec.model.event.Merchandise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MerchandiseRepository extends JpaRepository<Merchandise, Long> {
    Optional<Merchandise> findByEventEventId(Long eventId);

}

