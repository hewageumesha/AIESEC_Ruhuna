
package com.aiesec.controller.event;

import com.aiesec.dto.AiesecMemberEventRegistrationDTO;
import com.aiesec.dto.EventRegistrationSummaryDTO;
import com.aiesec.dto.RegistrationDTO;
import com.aiesec.model.event.AiesecMemberEventRegistration;
import com.aiesec.service.interfaces.AiesecMemberEventRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/member-event-registrations")
@RequiredArgsConstructor
public class AiesecMemberEventRegistrationController {


    private final AiesecMemberEventRegistrationService registrationService;

    @PostMapping("/register")
    public ResponseEntity<AiesecMemberEventRegistrationDTO> register(@RequestBody AiesecMemberEventRegistrationDTO dto) {
        System.out.println("🚀 Incoming DTO: " + dto);
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
    @GetMapping("/summary/status")
    public ResponseEntity<?> getStatusSummaryByEvent(@RequestParam Long eventId) {
        try {
            Map<String, Integer> summary = registrationService.getStatusSummaryByEvent(eventId);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            e.printStackTrace();  // Log the real error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error", "message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRegistration(@PathVariable Long id, @RequestBody RegistrationDTO dto) {
        try {
            AiesecMemberEventRegistration updated = registrationService.updateRegistration(id, dto);

            RegistrationDTO responseDto = new RegistrationDTO();
            responseDto.setEventId(updated.getEventId());
            responseDto.setUserId(updated.getUserId());
            responseDto.setInterestStatus(String.valueOf(updated.getInterestStatus()));
            responseDto.setComment(updated.getComment());

            return ResponseEntity.ok(responseDto);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

}
