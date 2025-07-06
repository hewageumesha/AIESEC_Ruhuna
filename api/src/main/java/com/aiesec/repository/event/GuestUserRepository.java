package com.aiesec.repository.event;



import com.aiesec.model.event.GuestUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestUserRepository extends JpaRepository<GuestUser, Long> {
    GuestUser findByEmail(String email);
}

