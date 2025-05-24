package com.aiesec.controller.event;

import com.aiesec.dto.AiesecMemberEventRegistrationDTO;
import com.aiesec.service.interfaces.AiesecMemberEventRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/member-event-registrations")
@RequiredArgsConstructor
public class AiesecMemberEventRegistrationController {

    private final AiesecMemberEventRegistrationService registrationService;

    @PostMapping("/register")
    public ResponseEntity<AiesecMemberEventRegistrationDTO> register(@RequestBody AiesecMemberEventRegistrationDTO dto) {
        AiesecMemberEventRegistrationDTO registered = registrationService.register(dto);
        return ResponseEntity.ok(registered);
    }

    @GetMapping("/user/{userId}/event/{eventId}")
    public ResponseEntity<List<AiesecMemberEventRegistrationDTO>> getRegistrationsByUserAndEvent(
            @PathVariable Long userId,
            @PathVariable Long eventId) {
        List<AiesecMemberEventRegistrationDTO> registrations = registrationService.getByUserIdAndEventId(userId, eventId);
        return ResponseEntity.ok(registrations);
    }

    @GetMapping("/exists")
    public ResponseEntity<Boolean> checkIfRegistered(
            @RequestParam Long userId,
            @RequestParam Long eventId) {
        boolean exists = registrationService.alreadyRegistered(userId, eventId);
        return ResponseEntity.ok(exists);
    }
}
