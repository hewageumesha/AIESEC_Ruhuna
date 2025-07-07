package com.aiesec.config;

import com.aiesec.service.Google;
import com.aiesec.model.BirthdayPerson;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class GoogleSheetConfig {

    @Bean
    public CommandLineRunner testGoogleSheetAccess(Google google) {
        return args -> {
            try {
                List<BirthdayPerson> people = google.fetchAndSaveBirthdays();
                System.out.println("🎉 Fetched birthday data:");
                for (BirthdayPerson person : people) {
                    System.out.println("Name: " + person.getName() + ", Birthday: " + person.getBirthday());
                }
            } catch (Exception e) {
                System.err.println("❌ Failed to fetch birthday data: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }
}
