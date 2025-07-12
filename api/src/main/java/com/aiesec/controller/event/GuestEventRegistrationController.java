package com.aiesec.controller.event;

import com.aiesec.dto.GuestEventRegistrationDTO;
import com.aiesec.dto.GuestRegistrationSummaryDTO;
import com.aiesec.service.interfaces.GuestEventRegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/guest-registrations")
@RequiredArgsConstructor
public class GuestEventRegistrationController {

    private final GuestEventRegistrationService registrationService;

    @PostMapping
    public ResponseEntity<?> registerGuest(@Valid @RequestBody GuestEventRegistrationDTO dto,
                                           BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getAllErrors()
                    .stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .collect(Collectors.toList());
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            GuestEventRegistrationDTO savedDto = registrationService.register(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDto);
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiError("Registration Conflict", ex.getMessage()));
        }
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<GuestEventRegistrationDTO>> getRegistrationsByEventId(@PathVariable Long eventId) {
        List<GuestEventRegistrationDTO> registrations = registrationService.getAllByEventId(eventId);
        return ResponseEntity.ok(registrations);
    }

    @GetMapping("/analytics/summary")
    public ResponseEntity<List<GuestRegistrationSummaryDTO>> getAnalyticsSummary() {
        return ResponseEntity.ok(registrationService.getSummaryByEvent());
    }


    // Inner class for structured error response
    public static class ApiError {
        private String error;
        private String message;

        public ApiError(String error, String message) {
            this.error = error;
            this.message = message;
        }

        public String getError() {
            return error;
        }

        public String getMessage() {
            return message;
        }
    }

    @GetMapping("/analytics/summary/status")
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

    @GetMapping("/event/{eventId}/paged")
    public ResponseEntity<Page<GuestEventRegistrationDTO>> getPagedRegistrations(
            @PathVariable Long eventId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<GuestEventRegistrationDTO> pagedResult = registrationService.getPagedByEventId(eventId, page, size);
        return ResponseEntity.ok(pagedResult);
    }


}
