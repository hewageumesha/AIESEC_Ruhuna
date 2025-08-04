package com.aiesec.controller;

import com.aiesec.service.ForgotPasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/forgot-password")
@CrossOrigin(origins = "*")
public class ForgotPasswordController {

    @Autowired
    private ForgotPasswordService forgotPasswordService;

    @PostMapping("/verifyMail/{email}")
    public ResponseEntity<Map<String, String>> verifyEmail(@PathVariable String email) {
        Map<String, String> response = new HashMap<>();
        forgotPasswordService.sendOtp(email);
        response.put("message", "OTP sent successfully to " + email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verifyOtp/{otp}/{email}")
    public ResponseEntity<Map<String, String>> verifyOtp(@PathVariable String otp, @PathVariable String email) {
        Map<String, String> response = new HashMap<>();

        if (forgotPasswordService.verifyOtp(email, otp)) {
            forgotPasswordService.clearOtp(email); // Optional
            response.put("message", "OTP verified successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Invalid or expired OTP");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/changePassword/{email}")
    public ResponseEntity<Map<String, String>> changePassword(@PathVariable String email, @RequestBody Map<String, String> payload) {
        Map<String, String> response = new HashMap<>();
        String password = payload.get("password");
        String confirmPassword = payload.get("confirmPassword");

        if (!password.equals(confirmPassword)) {
            response.put("message", "Passwords do not match");
            return ResponseEntity.badRequest().body(response);
        }

        // Simulate password update
        System.out.println("Password reset for: " + email);
        response.put("message", "Password reset successful");
        return ResponseEntity.ok(response);
    }
}
