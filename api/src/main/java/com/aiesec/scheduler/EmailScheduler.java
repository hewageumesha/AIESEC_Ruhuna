package com.aiesec.scheduler;

import com.aiesec.model.Birthday;
import com.aiesec.repository.BirthdayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class EmailScheduler {

    @Autowired
    private BirthdayRepository repository;

    @Scheduled(cron = "0 0 9 * * ?") // Every day at 9 AM
    public void sendBirthdayReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Birthday> birthdays = repository.findByDate(tomorrow);

        if (!birthdays.isEmpty()) {
            StringBuilder message = new StringBuilder("<h2>Upcoming Birthdays</h2><ul>");
            for (Birthday b : birthdays) {
                message.append("<li>").append(b.getDate()).append(" - ").append(b.getName())
                        .append("<br><img src=\"").append(b.getPhotoUrl()).append("\" width=\"100\"/></li>");
            }
            message.append("</ul>");

            
            System.out.println(message.toString());
        }
    }
}
