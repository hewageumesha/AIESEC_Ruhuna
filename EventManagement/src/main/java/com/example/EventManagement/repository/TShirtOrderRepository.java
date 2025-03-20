package com.example.EventManagement.repository;

import com.example.EventManagement.entity.TshirtOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TShirtOrderRepository extends JpaRepository<TshirtOrder, Long> {
    // Find orders by email (optional)
    List<TshirtOrder> findByEmail(String email);
}