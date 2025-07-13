package com.aiesec.controller;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aiesec.enums.UserRole;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "*")
public class RoleController {

    @GetMapping("/all")
    public List<String> getAllRoles() {
        // Convert enum values to a list of string names
        return Arrays.stream(UserRole.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }
}
