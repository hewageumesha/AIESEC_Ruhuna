package com.aiesec.repository;

import java.util.Optional;

import com.aiesec.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Long>{
    Optional<User> findByAiesecEmail(String aiesecEmail);
    Optional<User> findByAiesecEmailAndPassword(String aiesecEmail, String password);
    void deleteByAiesecEmail(String aieseEmail);
}
