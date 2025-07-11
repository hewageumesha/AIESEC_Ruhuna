package com.aiesec.scheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.aiesec.service.Google;
import com.aiesec.service.EmailService;
import com.aiesec.model.BirthdayPerson;
import com.aiesec.service.BirthdayReminderService;



import java.util.List;

@Service
public class BirthdayScheduler {

    @Autowired
    private Google google;

    @Autowired
    private EmailService emailService;

    @Scheduled(cron = "0 0 8 * * ?")  // This will run every day at 8 AM
    public void checkAndNotify() throws Exception {
        List<BirthdayPerson> allPeople = google.fetchAndSaveBirthdays();
        List<BirthdayPerson> birthdaysTomorrow = new BirthdayReminderService().getTomorrowBirthdays(allPeople);

        for (BirthdayPerson person : birthdaysTomorrow) {
            emailService.sendFlyerEmail(person);
        }
    }
}
