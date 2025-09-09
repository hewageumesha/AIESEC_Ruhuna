package com.aiesec.service.birthday;

import com.aiesec.dto.BirthdayDTO;
//import com.aiesec.repository.BirthdayRepository;
import jakarta.mail.MessagingException;
import org.springframework.stereotype.Service;
import com.aiesec.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Date;
import com.aiesec.repository.UserRepository;  
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BirthdayReminderService {

    private final BirthdayEmailService emailService;
    private final UserRepository userRepository;

    public BirthdayReminderService(BirthdayEmailService emailService, UserRepository userRepository) {
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    // Send reminder if tomorrow is someone's birthday
    public void checkAndSendReminders() throws MessagingException {
        LocalDate tomorrow = LocalDate.now().plusDays(1);

        List<BirthdayDTO> allBirthdays = userRepository.findAllBirthdays();

        List<BirthdayDTO> tomorrowBirthdays = allBirthdays.stream()
                .filter(b -> {
                    LocalDate bd = b.getBirthday()
                            .toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate();
                    return bd.getDayOfMonth() == tomorrow.getDayOfMonth()
                            && bd.getMonthValue() == tomorrow.getMonthValue();
                })
                .collect(Collectors.toList());

        for (BirthdayDTO person : tomorrowBirthdays) {
            emailService.sendFlyerEmail(person);
        }
    }

    // Get all birthdays
    public List<BirthdayDTO> getAllBirthdays() {
        return userRepository.findAllBirthdays();
    }

   // Save or update a birthday for a user
public BirthdayDTO saveBirthday(Long userId, Date birthday) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    
    java.sql.Date sqlDate = new java.sql.Date(birthday.getTime());
    user.setBirthday(sqlDate);

    User saved = userRepository.save(user);

    return new BirthdayDTO(
            saved.getId(),
            saved.getFirstName() + " " + saved.getLastName(),
            saved.getBirthday(),
            saved.getProfilePicture()
    );
}

}
