package com.aiesec.controller;
import com.aiesec.model.User;
import com.aiesec.service.UserService;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

}
