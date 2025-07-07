package com.aiesec.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import com.aiesec.model.BirthdayPerson;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendFlyerEmail(BirthdayPerson person) throws MessagingException {
        String to = "sajiyaroshan2001@gmail.com";  // Recipient
        String from = "personalmyproject2025@gmail.com";  // <-- Very important (verified sender in SendGrid)
        String subject = "Reminder: Please Create Flyer for " + person.getName() + "'s Birthday Tomorrow";
    
        String htmlContent = "<html><body style='font-family:Arial, sans-serif; background-color:#f8f9fa; text-align:center; padding:30px;'>" +
        "<div style='background-color:#ffffff; padding:25px; border-radius:10px; box-shadow:0 4px 10px rgba(0, 0, 0, 0.1); width:90%; max-width:600px; margin:0 auto;'>" +
        "<h2 style='color:#4CAF50;'>🎂 Reminder: " + person.getName() + "'s Birthday is Tomorrow!</h2>" +
        "<p style='font-size:16px; color:#333;'>This is a gentle reminder that <strong>" + person.getName() + "</strong> has a birthday tomorrow (<strong>" + person.getBirthday() + "</strong>).</p>" +
        "<p style='font-size:16px; color:#555;'>Click the link below to view the photo of " + person.getName() + "'s birthday:</p>" +
        "<a href='" + person.getPhotoUrl() + "' target='_blank' style='color:#4CAF50; text-decoration:none; font-size:18px;'>View Photo</a>" +
        "<p style='font-size:16px; color:#555;'>Please prepare and share the birthday flyer with the team.</p>" +
        "<p style='font-size:14px; color:#888; margin-top:30px;'>– Birthday Notifier System</p>" +
        "</div></body></html>";
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
    
            helper.setFrom(from); // <-- This line is necessary!
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
    
            mailSender.send(message);
        } catch (MailException e) {
            e.printStackTrace();
            System.out.println("Error sending email: " + e.getMessage());
        }

        System.out.println("✅ Email sent successfully for " + person.getName());

    }
}
    