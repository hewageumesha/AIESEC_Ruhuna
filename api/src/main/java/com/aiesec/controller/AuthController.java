package com.aiesec.controller;

// Import required classes and annotations
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

    // Endpoint to sign in a user (Login)
    @PostMapping("/signin")
    public ResponseEntity<Object> signIn(@RequestBody User user) {
        // Validate that email and password are provided
        if (user.getAiesecEmail() == null || user.getPassword() == null) {
            return ResponseEntity
                    .badRequest()  // 400 Bad Request
                    .body("Email and password must be provided");
        }

        // Get user from the database by AIESEC email
        Optional<User> existingUser = userService.getUserByAiesecEmail(user.getAiesecEmail());

        // If no user is found with the given AIESEC email
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

        // If authentication is successful, generate a JWT token using the email
        String token = jwtUtil.generateToken(existingUser.get().getAiesecEmail());

        // Create a JSON object to return as the response
        JSONObject json = new JSONObject();
        json.put("role", existingUser.get().getRole());
        json.put("email", existingUser.get().getAiesecEmail());
        json.put("token", token);

        // Return the token and user details with a 200 OK status
        return ResponseEntity
                .ok()  // 200 OK
                .body(json.toString());
    }

     // Endpoint to sign out a user (currently just sends a success message)
    @PostMapping("/signout")
    public ResponseEntity<Map<String, String>> signOut() {

        // Since JWT is stateless, sign-out is handled on the client side
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response); // Return 200 OK with the message
    }
}

