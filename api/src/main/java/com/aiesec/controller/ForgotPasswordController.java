package com.aiesec.controller;

import org.springframework.web.bind.annotation.RestController;

import com.aiesec.Record.ChangePassword;
import com.aiesec.Record.MailBody;
import com.aiesec.model.ForgotPassword;
import com.aiesec.model.User;
import com.aiesec.repository.ForgotPasswordRepository;
import com.aiesec.repository.UserRepository;
import com.aiesec.service.EmailService;

import org.springframework.web.bind.annotation.RequestMapping;

import java.time.Instant;
import java.util.Date;
import java.util.Objects;
import java.util.Random;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/forgot-password")
public class ForgotPasswordController {
    private final UserRepository userRepository;

    private final EmailService emailService;

    private final ForgotPasswordRepository forgotPasswordRepository;

    private final PasswordEncoder passwordEncoder;

    public ForgotPasswordController(UserRepository userRepository, EmailService emailService, ForgotPasswordRepository forgotPasswordRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.forgotPasswordRepository = forgotPasswordRepository;
        this.passwordEncoder = passwordEncoder;
    }

    //send main for email verification
    @PostMapping("/verifyMail/{aiesecEmail}")
    public ResponseEntity<String> verifyEmail(@PathVariable String aiesecEmail) {
        User user = userRepository.findByAiesecEmail(aiesecEmail)
                            .orElseThrow(() -> new UsernameNotFoundException("Please provide valid AIESEC email!"));
                
        int otp = otpGenerator();
        
        MailBody mailBody = MailBody.builder()
                 .to(aiesecEmail)
                 .text("This is the OTP for your Forgot Password request: " + otp)
                 .subject("OTP for Forgot Password")
                 .build();
                
        ForgotPassword forgotPassword = ForgotPassword.builder()
                .otp(otp)
                .expirationTime(new Date(System.currentTimeMillis() + 10 * 60 * 1000))
                .user(user)
                .build();

        emailService.sendPasswordResetEmail(mailBody);
        forgotPasswordRepository.save(forgotPassword);

        return ResponseEntity.ok("Email sent for verification!");
    } 

    @PostMapping("/verigyOtp/{otp}/{aiesecEmail}")
    public ResponseEntity<String> verifyOtp(@PathVariable Integer otp, @PathVariable String aiesecEmail) {
        User user = userRepository.findByAiesecEmail(aiesecEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Please provide valid AIESEC email!"));
        
        ForgotPassword forgotPassword =  forgotPasswordRepository.findByOtpAndUser(otp, user)
                .orElseThrow(() -> new UsernameNotFoundException("Please provide an valid email! " + aiesecEmail));
        
                if(forgotPassword.getExpirationTime().before(Date.from(Instant.now()))) {
            forgotPasswordRepository.deleteById(forgotPassword.getForgotPasswordId());
            return new ResponseEntity<>("OTP expired! Please request a new OTP!", HttpStatus.EXPECTATION_FAILED);
        }

        return ResponseEntity.ok("OTP verified successfully! You can now reset your password.");
    }

    @PostMapping("/changePassword/{aiesecEmail}")
    public ResponseEntity<String> changePasswordHandler(@RequestBody ChangePassword changePassword, @PathVariable String aiesecEmail) {
        if(!Objects.equals(changePassword.password(), changePassword.repeatPassword())) {
            return new ResponseEntity<>("Passwords do not match! Please try again.", HttpStatus.EXPECTATION_FAILED);
        }

        String encodedPassword = passwordEncoder.encode(changePassword.password());
        userRepository.updatePassword(aiesecEmail, encodedPassword);

        return ResponseEntity.ok("Password changed successfully!");
    }
    
    
    private Integer otpGenerator() { 
        Random random = new Random();
        return random.nextInt(100_000, 999_999);
    }
}
