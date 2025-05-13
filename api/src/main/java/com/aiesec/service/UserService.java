package com.aiesec.service;

import com.aiesec.model.User;
import com.aiesec.repository.event.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileUploadService fileUploadService;

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

//    public User updateUserProfile(String aiesecEmail, User userDetails, MultipartFile profilePhoto) throws IOException {
//        User user = userRepository.findByAiesecEmail(aiesecEmail)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        // Update allowed fields
//        user.setFirstName(userDetails.getFirstName());
//        user.setLastName(userDetails.getLastName());
//        user.setEmail(userDetails.getEmail());
//
//        // Handle profile photo upload
//        if (profilePhoto != null && !profilePhoto.isEmpty()) {
//            String photoUrl = fileUploadService.uploadProfilePhoto(profilePhoto, aiesecEmail);
//            user.setProfilePicture(photoUrl);
//        }
//
//        return userRepository.save(user);
//    }
}
