package com.aiesec.controller;

import com.aiesec.dto.BirthdayDTO;
import com.aiesec.service.BirthdayReminderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/birthdays")
public class BirthdayController {

    private final BirthdayReminderService birthdayService;

    public BirthdayController(BirthdayReminderService birthdayService) {
        this.birthdayService = birthdayService;
    }

    // GET: fetch all birthdays
    @GetMapping
    public List<BirthdayDTO> getBirthdays() {
        return birthdayService.getAllBirthdays();
    }

    // POST: add a new birthday
   @PostMapping
public BirthdayDTO addBirthday(@RequestBody BirthdayDTO birthdayDTO) {
    // Assuming you add `userId` inside DTO
    return birthdayService.saveBirthday(birthdayDTO.getUserId(), birthdayDTO.getBirthday());
}

}
