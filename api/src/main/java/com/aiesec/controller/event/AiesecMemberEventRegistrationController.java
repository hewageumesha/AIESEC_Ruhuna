// UPDATED CONTROLLER
package com.aiesec.controller.event;

import com.aiesec.dto.AiesecMemberEventRegistrationDTO;
import com.aiesec.dto.EventRegistrationSummaryDTO;
import com.aiesec.service.interfaces.AiesecMemberEventRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/member-event-registrations")
@RequiredArgsConstructor
public class AiesecMemberEventRegistrationController {

    private final AiesecMemberEventRegistrationService registrationService;

    @PostMapping("/register")
    public ResponseEntity<AiesecMemberEventRegistrationDTO> register(@RequestBody AiesecMemberEventRegistrationDTO dto) {
        try {
            AiesecMemberEventRegistrationDTO registered = registrationService.register(dto);
            return ResponseEntity.ok(registered);
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
        }
    }

    @GetMapping("/user/{userId}/event/{eventId}")
    public ResponseEntity<List<AiesecMemberEventRegistrationDTO>> getRegistrationsByUserAndEvent(
            @PathVariable Long userId,
            @PathVariable Long eventId) {
        return ResponseEntity.ok(registrationService.getByUserIdAndEventId(userId, eventId));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<AiesecMemberEventRegistrationDTO>> getRegistrationsByEventId(@PathVariable Long eventId) {
        return ResponseEntity.ok(registrationService.getByEventId(eventId));
    }

    @GetMapping("/summary")
    public ResponseEntity<List<EventRegistrationSummaryDTO>> getSummaryByEvent() {
        return ResponseEntity.ok(registrationService.getSummaryByEvent());
    }


    @GetMapping("/exists")
    public ResponseEntity<Boolean> checkIfRegistered(@RequestParam Long userId, @RequestParam Long eventId) {
        return ResponseEntity.ok(registrationService.alreadyRegistered(userId, eventId));
    }
}
