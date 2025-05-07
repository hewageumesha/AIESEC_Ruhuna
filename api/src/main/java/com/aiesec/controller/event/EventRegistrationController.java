package com.aiesec.controller.event;

import com.aiesec.dto.AiesecMemberEventRegistrationDTO;
import com.aiesec.dto.GuestEventRegistrationDTO;
import com.aiesec.service.interfaces.EventRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/event-registrations")
public class EventRegistrationController {
    @Autowired
    private EventRegistrationService registrationService;

    @PostMapping("/member")
    public ResponseEntity<?> registerMember(@RequestBody AiesecMemberEventRegistrationDTO dto) {
        registrationService.registerMember(dto);
        return ResponseEntity.ok("AIESEC Member Registered");
    }

    @PostMapping("/guest")
    public ResponseEntity<?> registerGuest(@RequestBody GuestEventRegistrationDTO dto) {
        registrationService.registerGuest(dto);
        return ResponseEntity.ok("Guest Registered");
    }

}
