package com.example.EventManagement.repository;

import com.example.EventManagement.entity.Merchandise;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MerchandiseRepository extends JpaRepository<Merchandise, Long> {
}
