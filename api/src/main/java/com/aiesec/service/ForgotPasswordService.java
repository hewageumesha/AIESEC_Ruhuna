package com.aiesec.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aiesec.Record.MailBody;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class ForgotPasswordService {

    private final Map<String, String> otpStore = new HashMap<>();

    @Autowired
    private EmailService emailService;

    public String sendOtp(String email) {
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        otpStore.put(email, otp);

        // Send email
        String subject = "AIESEC OTP Code";
        String body = "Your OTP code is: " + otp + "\n\nThis code is valid for 5 minutes.";
        MailBody mail = new MailBody(email, subject, body);
        emailService.sendPasswordResetEmail(mail);

        return otp;
    }

    public boolean verifyOtp(String email, String enteredOtp) {
        String validOtp = otpStore.get(email);
        return validOtp != null && validOtp.equals(enteredOtp);
    }

    public void clearOtp(String email) {
        otpStore.remove(email);
    }
}
