package com.aiesec.controller;

// Import required classes and annotations
import com.aiesec.model.User;
import com.aiesec.security.JwtUtil;
import com.aiesec.service.SessionService;
import com.aiesec.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*") // Allows requests from any origin (CORS policy)
@RestController // Marks this class as a REST controller
@RequestMapping("/api/auth") // Base URL for all endpoints in this controller
public class AuthController {

     // Injecting the JWT utility class to generate tokens
    @Autowired
    private JwtUtil jwtUtil;

    // Injecting the UserService to handle user-related operations
    @Autowired
    private UserService userService;

    @Autowired
    private SessionService sessionService;

    // Endpoint to sign in a user (Login)
    @PostMapping("/signin")
    public ResponseEntity<Object> signIn(@RequestBody User user, HttpServletRequest request) {
        if (user.getAiesecEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email and password must be provided");
        }

        Optional<User> existingUser = userService.getUserByAiesecEmail(user.getAiesecEmail());

        if (!existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with email: " + user.getAiesecEmail());
        }

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        if (!passwordEncoder.matches(user.getPassword(), existingUser.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }

        // Log login event
        String ipAddress = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        sessionService.logLogin(existingUser.get().getAiesecEmail(), ipAddress, userAgent);

        String token = jwtUtil.generateToken(existingUser.get().getAiesecEmail());

        JSONObject json = new JSONObject();
        json.put("role", existingUser.get().getRole());
        json.put("aiesecEmail", existingUser.get().getAiesecEmail());
        json.put("token", token);

        return ResponseEntity.ok().body(json.toString());
    }

    @PostMapping("/signout")
    public ResponseEntity<Map<String, String>> signOut(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7); // Remove "Bearer "
        String userEmail = jwtUtil.extractUsername(token);

        sessionService.logLogout(userEmail);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/session-expired")
    public ResponseEntity<?> sessionExpired() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session expired due to inactivity.");
    }

    @GetMapping("/sessions")
    public ResponseEntity<?> getAllSessionLogs() {
        return ResponseEntity.ok(sessionService.getAllSessionsWithRoles());
    }
}