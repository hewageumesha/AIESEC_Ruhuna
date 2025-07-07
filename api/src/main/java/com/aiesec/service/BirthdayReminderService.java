package com.aiesec.service;

import com.aiesec.model.BirthdayPerson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.mail.MessagingException;

@Service
public class BirthdayReminderService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private Google google;

    // Method to check and send reminders for tomorrow's birthdays
    public void checkAndSendReminders() throws Exception {  // Add throws for handling any exception
        try {
            // Fetch all birthday people
            List<BirthdayPerson> allPeople = google.fetchAndSaveBirthdays();

            // Get a list of people whose birthdays are tomorrow
            List<BirthdayPerson> tomorrowBirthdays = getTomorrowBirthdays(allPeople);

            // Send reminder for each person whose birthday is tomorrow
            for (BirthdayPerson person : tomorrowBirthdays) {
                emailService.sendFlyerEmail(person);  // Use the existing sendFlyerEmail() method
            }
        } catch (MessagingException e) {
            e.printStackTrace();  // Log or handle the exception appropriately
            throw e;  // Re-throw the exception if you want to propagate it further
        } catch (Exception e) {
            e.printStackTrace();  // Log any other exception
            throw e;  // Re-throw the exception if you want to propagate it further
        }
    }

    // Make this method public so that it can be accessed from other classes
    public List<BirthdayPerson> getTomorrowBirthdays(List<BirthdayPerson> allPeople) {
        LocalDate tomorrow = LocalDate.now().plusDays(1);  // Get tomorrow's date
        return allPeople.stream()
                .filter(p -> p.getBirthday().withYear(tomorrow.getYear()).equals(tomorrow))
                .collect(Collectors.toList());
    }
}
