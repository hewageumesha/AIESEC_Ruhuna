package com.aiesec.controller;
import com.aiesec.model.User;
import com.aiesec.service.UserService;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/add")
    public User addUser(@RequestBody User user) {
        return userService.addUser(user);
    }

    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable String aiesecEmail, @RequestBody User userDetails) {
        return userService.updateUser(aiesecEmail, userDetails);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable String aiesecEmail) {
        userService.deleteUser(aiesecEmail);
        return "User deleted successfully";
    }

    @GetMapping("/{aiesecEmail}")
    public Optional<User> getUserByAiesecEmail(@PathVariable String aiesecEmail) {
        return userService.getUserByAiesecEmail(aiesecEmail);
    }

    @GetMapping("/profile/{aiesecEmail}")
    public User getUserProfile(@PathVariable String aiesecEmail) {
        return userService.getUserByAiesecEmail(aiesecEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /* 
    @PutMapping(value = "/profile/update/{aiesecEmail}", consumes = {"multipart/form-data"})
    public User updateUserProfile(
            @PathVariable String aiesecEmail,
            @RequestPart User userDetails,
            @RequestPart(required = false) MultipartFile profilePhoto) throws Exception {
        
        return userService.updateUserProfile(aiesecEmail, userDetails, profilePhoto);
    }
    */
}
