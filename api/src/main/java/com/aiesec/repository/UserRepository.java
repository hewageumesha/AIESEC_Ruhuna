package com.aiesec.repository;


import com.aiesec.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByAiesecEmail(String aiesecEmail);
    Optional<User> findByAiesecEmailAndPassword(String aiesecEmail, String password);
    void deleteByAiesecEmail(String aiesecEmail);


}

