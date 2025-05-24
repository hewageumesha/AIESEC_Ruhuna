package com.aiesec.controller.event;

import com.aiesec.dto.GuestEventRegistrationDTO;
import com.aiesec.repository.event.GuestEventRegistrationRepository;
import com.aiesec.service.interfaces.GuestEventRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guest-registrations")
@RequiredArgsConstructor
public class GuestEventRegistrationController {

    private final GuestEventRegistrationService registrationService;
    private final GuestEventRegistrationRepository registrationRepository;

    // 1. Register guest (prevent duplicates)
    @PostMapping
    public ResponseEntity<?> registerGuest(@RequestBody GuestEventRegistrationDTO dto) {
        boolean alreadyRegistered = registrationRepository.existsByEventIdAndEmail(dto.getEventId(), dto.getEmail());

        if (alreadyRegistered) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("You have already registered for this event with this email.");
        }

        GuestEventRegistrationDTO savedDto = registrationService.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDto);
    }

    // 2. Get all guest registrations for an event
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<GuestEventRegistrationDTO>> getRegistrationsByEventId(@PathVariable Long eventId) {
        List<GuestEventRegistrationDTO> registrations = registrationService.getAllByEventId(eventId);
        return ResponseEntity.ok(registrations);
    }
}
