package com.aiesec.service;

import com.aiesec.model.Birthday;
import com.aiesec.model.BirthdayPerson;
import com.aiesec.repository.BirthdayRepository;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.model.ValueRange;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class Google {

    private static final String APPLICATION_NAME = "Birthday Notifier";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String SPREADSHEET_ID = "1_0qdg9lbJmMG4OAmghccPx_Yc5XQUz14SpzaW61cdY4";
    private static final String RANGE = "Sorted Birthdays!A2:E";

    private final BirthdayRepository birthdayRepository;

    public Google(BirthdayRepository birthdayRepository) {
        this.birthdayRepository = birthdayRepository;
    }

    public List<BirthdayPerson> fetchAndSaveBirthdays() throws Exception {
        // ✅ Load credentials from GOOGLE_APPLICATION_CREDENTIALS environment variable
        GoogleCredentials credentials = GoogleCredentials
                .getApplicationDefault()
                .createScoped(Collections.singleton("https://www.googleapis.com/auth/spreadsheets.readonly"));

        Sheets service = new Sheets.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JSON_FACTORY,
                new HttpCredentialsAdapter(credentials)
        ).setApplicationName(APPLICATION_NAME).build();

        ValueRange response = service.spreadsheets().values()
                .get(SPREADSHEET_ID, RANGE)
                .execute();

        List<List<Object>> values = response.getValues();
        List<BirthdayPerson> birthdayPeople = new ArrayList<>();

        if (values != null && !values.isEmpty()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/yyyy");

            for (List<Object> row : values) {
                try {
                    String name = row.get(0).toString(); // Column A
                    String birthdayStr = row.get(2).toString(); // Column C (birth date)
                    String photoUrl = row.size() > 4 ? row.get(4).toString() : null; // Column E

                    LocalDate birthdayDate = LocalDate.parse(birthdayStr, formatter);

                    Birthday birthdayEntity = new Birthday(name, birthdayDate, photoUrl);

                    // Check if already exists
                    boolean exists = birthdayRepository
                            .findByDate(birthdayDate)
                            .stream()
                            .anyMatch(b -> b.getName().equalsIgnoreCase(name));

                    if (!exists) {
                        birthdayRepository.save(birthdayEntity);
                        System.out.println("✅ Saved: " + name);
                    } else {
                        System.out.println("⚠️ Skipped (already exists): " + name);
                    }

                    // Convert to BirthdayPerson
                    birthdayPeople.add(new BirthdayPerson(name, birthdayDate, photoUrl));

                } catch (Exception e) {
                    System.err.println("❌ Error parsing row: " + row);
                    e.printStackTrace();
                }
            }
        }

        return birthdayPeople;
    }
}