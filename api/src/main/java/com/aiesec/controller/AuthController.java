package com.aiesec.controller;

import com.aiesec.model.User;
import com.aiesec.security.JwtUtil;
import com.aiesec.service.UserService;

import java.util.HashMap;
import java.util.Map;
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
        if (user.getAiesecEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email and password must be provided");
        }

        Optional<User> existingUserOpt = userService.getUserByAiesecEmail(user.getAiesecEmail());

        if (existingUserOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with email: " + user.getAiesecEmail());
        }

        User existingUser = existingUserOpt.get();
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid password");
        }

        String token = jwtUtil.generateToken(existingUser.getAiesecEmail());

        // ✅ Include ID and other user info in response
        JSONObject json = new JSONObject();
        json.put("id", existingUser.getId());
        json.put("firstName", existingUser.getFirstName());
        json.put("lastName", existingUser.getLastName());
        json.put("aiesecEmail", existingUser.getAiesecEmail());
        json.put("email", existingUser.getEmail());
        json.put("phone", existingUser.getPhone());
        json.put("role", existingUser.getRole());
        json.put("token", token);

        return ResponseEntity.ok(json.toString());
    }

    @PostMapping("/signout")
    public ResponseEntity<Map<String, String>> signOut() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }
}
