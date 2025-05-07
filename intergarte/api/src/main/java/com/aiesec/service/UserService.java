package com.aiesec.service;

import com.aiesec.model.User;
import com.aiesec.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepo userRepository;


    // Method to add a new user
    public User addUser(User user) {
        Optional<User> existingUser = userRepository.findByAiesecEmail(user.getAiesecEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("User with email " + user.getAiesecEmail() + " already exists.");
        }

        return userRepository.save(user);
    }

    // Method to update user details
    public User updateUser(String aiesecEmail, User userDetails) {
        User user = userRepository.findByAiesecEmail(aiesecEmail)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + aiesecEmail));
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        return userRepository.save(user);
    }

    // Method to delete a user
    public void deleteUser(String aiesecEmail) {
        User user = userRepository.findByAiesecEmail(aiesecEmail)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + aiesecEmail));
        userRepository.delete(user);
    }

    // Method to retrieve a user by AIESEC email
    public Optional<User> getUserByAiesecEmail(String aiesecEmail) {
        try {
            return userRepository.findByAiesecEmail(aiesecEmail);
        } catch (Exception e) {
            // Log the exception
            logger.error("Error retrieving user by email: " + aiesecEmail, e);
            throw new RuntimeException("Error retrieving user by email");
        }
    }
}
