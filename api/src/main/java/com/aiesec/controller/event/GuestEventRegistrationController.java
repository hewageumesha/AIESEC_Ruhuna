package com.aiesec.controller.event;

import com.aiesec.dto.GuestEventRegistrationDTO;
import com.aiesec.service.interfaces.GuestEventRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guest-registrations")
@RequiredArgsConstructor
public class GuestEventRegistrationController {

    private final GuestEventRegistrationService registrationService;

    @PostMapping
    public ResponseEntity<GuestEventRegistrationDTO> registerGuest(@RequestBody GuestEventRegistrationDTO dto) {
        GuestEventRegistrationDTO saved = registrationService.register(dto);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<GuestEventRegistrationDTO>> getRegistrationsForEvent(@PathVariable Long eventId) {
        List<GuestEventRegistrationDTO> list = registrationService.getAllByEventId(eventId);
        return ResponseEntity.ok(list);
    }
}