package com.example.EventManagement.repository;

import com.example.EventManagement.entity.GuestUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestUserRepository extends JpaRepository<GuestUser, Long> {
    GuestUser findByEmail(String email);
}
