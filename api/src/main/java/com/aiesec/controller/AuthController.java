package com.aiesec.controller;

import com.aiesec.model.User;
import com.aiesec.security.JwtUtil;
import com.aiesec.service.UserService;

import java.util.Optional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired


    private UserService userService;

    @PostMapping("/signin")
    public ResponseEntity<Object> signIn(@RequestBody User user) {
        // Validate that email and password are provided
        if (user.getAiesecEmail() == null || user.getPassword() == null) {
            return ResponseEntity
                    .badRequest()  // 400 Bad Request
                    .body("Email and password must be provided");
        }

        // Get user from the database by email
        Optional<User> existingUser = userService.getUserByAiesecEmail(user.getAiesecEmail());
        if (existingUser == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)  // 404 Not Found
                    .body("User not found with email: " + user.getAiesecEmail());
        }

        // Create a new instance of BCryptPasswordEncoder
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        // Validate the password by comparing it to the hashed password in the database
        if (!passwordEncoder.matches(user.getPassword(), existingUser.get().getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)  // 401 Unauthorized
                    .body("Invalid password");
        }

        // If authentication is successful, generate a JWT token
        String token = jwtUtil.generateToken(existingUser.get().getAiesecEmail());

        JSONObject json = new JSONObject();
        json.put("role", existingUser.get().getRole());
        json.put("token", token);

        // Return the token in the response
        return ResponseEntity
                .ok()  // 200 OK
                .body(json.toString());
    }

    @PostMapping("/signout")
    public String signOut() {
        return "Logged out successfully";
    }
}

