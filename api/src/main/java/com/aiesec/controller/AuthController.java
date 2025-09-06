package com.aiesec.controller;

import com.aiesec.model.User;
import com.aiesec.security.JwtUtil;
import com.aiesec.service.JwtBlacklistService;
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
@RestController 
@RequestMapping("/api/auth") 
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private SessionService sessionService;

    @Autowired
    private JwtBlacklistService jwtBlacklistService;

    // Endpoint to sign in a user (Login)
    @PostMapping("/signin")
public ResponseEntity<Object> signIn(@RequestBody User user, HttpServletRequest request) {
    try {
        System.out.println("Incoming request: " + user);

        if (user.getAiesecEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email and password must be provided");
        }

        Optional<User> existingUser = userService.getUserByAiesecEmail(user.getAiesecEmail());
        System.out.println("User from DB: " + existingUser);

        if (!existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with email: " + user.getAiesecEmail());
        }

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        System.out.println("Raw Password: " + user.getPassword());
        System.out.println("Encoded Password in DB: " + existingUser.get().getPassword());

        if (!passwordEncoder.matches(user.getPassword(), existingUser.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }

        String ipAddress = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        System.out.println("IP: " + ipAddress + ", User-Agent: " + userAgent);

        sessionService.logLogin(existingUser.get().getAiesecEmail(), ipAddress, userAgent);

        String token = jwtUtil.generateToken(existingUser.get().getAiesecEmail());

        JSONObject json = new JSONObject();
        json.put("role", existingUser.get().getRole());
        json.put("aiesecEmail", existingUser.get().getAiesecEmail());
        json.put("token", token);

        return ResponseEntity.ok().body(json.toString());
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
    }
}


    @PostMapping("/signout")
    public ResponseEntity<Map<String, String>> signOut(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        String userEmail = "Unknown";

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            try {
                userEmail = jwtUtil.extractUsername(token);
                // Optionally blacklist token to prevent reuse
                jwtBlacklistService.blacklistToken(token);
            } catch (Exception e) {
                System.out.println("Token invalid or expired during signout: " + e.getMessage());
            }
        }

        // Log the logout attempt
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