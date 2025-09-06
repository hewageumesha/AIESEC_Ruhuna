package com.aiesec.runner;

import com.aiesec.service.BirthdayReminderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class BirthdayReminderRunner implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(BirthdayReminderRunner.class);

    @Autowired
    private BirthdayReminderService birthdayReminderService;

    @Override
    public void run(String... args) throws Exception {
        logger.info("Application started, checking for birthdays...");
        //birthdayReminderService.checkAndSendReminders();
    }
}
