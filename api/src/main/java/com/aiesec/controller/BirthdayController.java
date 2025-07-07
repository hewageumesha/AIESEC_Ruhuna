package com.aiesec.controller;

import com.aiesec.model.Birthday;
import com.aiesec.repository.BirthdayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class BirthdayController {

    @Autowired
    private BirthdayRepository repository;

    @Autowired
   
    @GetMapping("/birthdays")
    public List<Birthday> getAll() {
        return repository.findAll();
    }

    @PostMapping("/birthdays")
    public Birthday save(@RequestBody Birthday birthday) {
        return repository.save(birthday);
    
    }
    
}
